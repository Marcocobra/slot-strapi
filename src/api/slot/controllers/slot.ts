import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::slot.slot',
  ({ strapi }) => ({
    async find(ctx) {
      // Check if this is a page-specific search (has filters in query)
      const hasFilters = Object.keys(ctx.query.filters || {}).length > 0;

      if (hasFilters) {
        // Handle page-specific search with filters
        const filters = ctx.query.filters as Record<string, any>;
        const searchTerm = filters?.title?.$containsi;

        if (searchTerm) {
          // Create a new filter that matches either title or provider name
          ctx.query.filters = {
            $or: [
              { title: { $containsi: searchTerm } },
              { provider: { provider_name: { $containsi: searchTerm } } },
            ],
            // Preserve other filters (like slot_content_page)
            ...Object.fromEntries(
              Object.entries(filters || {}).filter(([key]) => key !== 'title')
            ),
          };
        }

        const { data, meta } = await super.find(ctx);
        return { data, meta };
      }

      // Safely decode the search query with error handling
      let searchQuery = '';
      try {
        const rawQuery = ctx.query.query?.toString().trim().toLowerCase() || '';
        // First try to decode any URL-encoded characters
        searchQuery = decodeURIComponent(rawQuery);
      } catch (error) {
        // If decoding fails, use the raw query
        searchQuery = ctx.query.query?.toString().trim().toLowerCase() || '';
      }

      const page = parseInt(
        (ctx.query['pagination[page]'] as string) || '1',
        10
      );
      const pageSize = parseInt(
        (ctx.query['pagination[pageSize]'] as string) || '10',
        10
      );
      const start = (page - 1) * pageSize;

      // Base population for all queries
      const populate = {
        thumbnail: true,
        slot_theme: true,
        provider: { populate: { provider_logo: true } },
        casinos: { populate: { thumbnail: true } },
        faq: true,
        ads_cards: { populate: { thumbnail: true } },
        slot_content_page: true,
        news_and_preview: true,
      };

      // If no search query, return paginated results
      if (!searchQuery) {
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      }

      // Parse query for specific types
      const isRtpQuery =
        searchQuery.includes('rtp') || searchQuery.includes('%');
      const isMaxWinQuery = searchQuery.toLowerCase().includes('x');
      const isVolatilityQuery = searchQuery.match(
        /(volatilità\s+)?(medium-low|medium-high|medio-bassa|medio-alta|medium low|medium high|medio bassa|medio alta|low|medium|high|alta|media|bassa)/i
      );

      // Extract numeric value based on query type
      let numericQuery = 0;
      if (isRtpQuery) {
        // For RTP queries, extract number after "rtp" or before "%"
        const rtpMatch = searchQuery.match(/(?:rtp\s*)?(\d+)(?:\s*%|$)/i);
        if (rtpMatch) {
          numericQuery = parseInt(rtpMatch[1], 10);
        }
      } else {
        // For other queries, extract any number
        numericQuery = parseFloat(searchQuery.replace(/[^0-9.]/g, ''));
      }
      const isNumeric = !isNaN(numericQuery);

      // Build filters with explicit typing to avoid TS errors
      const filters: any = {
        $or: [
          { title: { $containsi: searchQuery } }, // Slot name (partial match)
          { provider: { provider_name: { $containsi: searchQuery } } }, // Provider name
          { slot_theme: { title: { $containsi: searchQuery } } }, // Slot theme
          { game_type: { title: { $containsi: searchQuery } } }, // Game type
          { slot_content_page: { title: { $containsi: searchQuery } } }, // Content page
        ],
      };

      // Fetch slot content pages for dynamic keywords
      const slotContentPages = await strapi.entityService.findMany(
        'api::slot-content-page.slot-content-page',
        {
          fields: ['title', 'slug'],
          populate: {
            slots: {
              fields: ['title'],
            },
          },
        }
      );

      // Create dynamic slot type keywords from content pages
      const dynamicSlotTypes = slotContentPages.reduce((acc, page) => {
        if (page.title) {
          // Use the page title as a keyword and add common variations
          const keywords = [page.title.toLowerCase()];
          // Add common variations based on the title
          if (page.title.toLowerCase().includes('bar')) {
            keywords.push('slot da bar');
          } else if (page.title.toLowerCase().includes('vlt')) {
            keywords.push('slot vlt');
          }
          acc[page.slug] = keywords;
        }
        return acc;
      }, {});

      // Combine static and dynamic slot type keywords
      const slotTypeKeywords = {
        jackpot: ['jackpot', 'jp', 'progressive'],
        megaways: ['megaways', 'megaway'],
        ...dynamicSlotTypes,
      };

      // Check for slot type keywords in the search query
      for (const [type, keywords] of Object.entries(slotTypeKeywords)) {
        if (keywords.some((keyword) => searchQuery.includes(keyword))) {
          // For dynamic types, search in the corresponding content page
          if (dynamicSlotTypes[type]) {
            filters.$or.push({
              slot_content_page: {
                slug: { $eq: type },
              },
            });
          } else {
            // For static types, search in title
            filters.$or.push({ title: { $containsi: type } });
          }
        }
      }

      // Handle max win query (e.g., "5000x" or "5000")
      if (isNumeric) {
        if (isMaxWinQuery) {
          // If query includes 'x', search for max wins greater than or equal to the number
          filters.$or.push({ max_win: { $gte: numericQuery } });
        } else if (numericQuery >= 50) {
          // If it's just a number >= 50, also treat it as a max win query
          // This threshold is more appropriate for max wins
          filters.$or.push({ max_win: { $gte: numericQuery } });
        }
      }

      // Handle volatility query (e.g., "volatilità alta" or "high")
      if (isVolatilityQuery) {
        const volatilityMap: { [key: string]: string } = {
          'medium high': 'medium_high',
          'medium low': 'medium_low',
          'medio bassa': 'medium_low',
          'medio alta': 'medium_high',
          'medium-high': 'medium_high',
          'medium-low': 'medium_low',
          'medio-bassa': 'medium_low',
          'medio-alta': 'medium_high',
          alta: 'high',
          media: 'medium',
          bassa: 'low',
          high: 'high',
          medium: 'medium',
          low: 'low',
        };
        const volatility = volatilityMap[isVolatilityQuery[2].toLowerCase()];

        filters.$or.push({ volatility: { $eq: volatility } });
      }

      // Handle RTP query (e.g., "RTP 97%" or "97%" or "RTP 97")
      if (isRtpQuery && isNumeric && numericQuery >= 0) {
        const newRtpValue =
          numericQuery > 2000 ? numericQuery - 2000 : numericQuery;

        if (newRtpValue <= 100) {
          const rtpValue = numericQuery;
          filters.$or.push({
            rtp: { $gte: rtpValue > 2000 ? rtpValue - 2000 : rtpValue },
          });
        }
      }

      // Fetch filtered and paginated data for slots
      const [slots, slotsTotal] = await Promise.all([
        strapi.entityService.findMany('api::slot.slot', {
          filters,
          populate,
          pagination: { start, limit: pageSize },
          sort: isRtpQuery ? { rtp: 'asc' } : { title: 'asc' },
        }),
        strapi.entityService.count('api::slot.slot', {
          filters,
        }),
      ]);

      // Search for guides
      const [guides, guidesTotal] = await Promise.all([
        strapi.entityService.findMany('api::guide.guide', {
          filters: {
            $or: [
              { title: { $containsi: searchQuery } },
              { description: { $containsi: searchQuery } },
            ],
          },
          populate: {
            thumbnail: true,
          },
          pagination: { start, limit: pageSize },
        }),
        strapi.entityService.count('api::guide.guide', {
          filters: {
            $or: [
              { title: { $containsi: searchQuery } },
              { description: { $containsi: searchQuery } },
            ],
          },
        }),
      ]);

      // Return both slots and guides in separate arrays
      return {
        data: slots,
        guides: guides,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(slotsTotal / pageSize),
            total: slotsTotal,
          },
          guidesPagination: {
            page,
            pageSize,
            pageCount: Math.ceil(guidesTotal / pageSize),
            total: guidesTotal,
          },
        },
      };
    },
  })
);
