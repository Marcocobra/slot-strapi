import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::slot.slot',
  ({ strapi }) => ({
    async find(ctx) {
      const searchQuery =
        ctx.query.query?.toString().trim().toLowerCase() || '';
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
        related_slots: {
          populate: {
            thumbnail: true,
            slot_theme: true,
            slot_content_page: true,
          },
        },
      };

      // If no search query, return paginated results
      if (!searchQuery) {
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      }

      // Parse query for specific types
      const numericQuery = parseFloat(searchQuery.replace(/[^0-9.]/g, '')); // Extract numeric part
      const isNumeric = !isNaN(numericQuery);
      const isRtpQuery = searchQuery.includes('%');
      const isMaxWinQuery = searchQuery.toLowerCase().includes('x');
      const isVolatilityQuery = searchQuery.match(
        /(volatilità\s+)?(low|medium|high|alta|media|bassa)/i
      );
      const keywordQueries = [
        'jackpot',
        'megaways',
        'slot da bar',
        'slot gallina',
        'slot libri',
      ];

      // Build filters with explicit typing to avoid TS errors
      const filters: any = {
        $or: [
          { title: { $containsi: searchQuery } }, // Slot name (partial match)
          { provider: { provider_name: { $containsi: searchQuery } } }, // Provider name
          { slot_theme: { title: { $containsi: searchQuery } } }, // Slot theme
        ],
      };

      // Handle max win query (e.g., "5000x")
      if (isMaxWinQuery && isNumeric) {
        filters.$or.push({ max_win: { $gte: numericQuery } });
      }

      // Handle volatility query (e.g., "volatilità alta" or "high")
      if (isVolatilityQuery) {
        const volatilityMap: { [key: string]: string } = {
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

      // Handle RTP query (e.g., "RTP 96%")
      if (isRtpQuery && isNumeric) {
        filters.$or.push({ rtp: { $gte: numericQuery } });
      }

      // Handle keyword searches (e.g., "Jackpot", "Megaways")
      if (keywordQueries.some((keyword) => searchQuery.includes(keyword))) {
        filters.$or.push({ title: { $containsi: searchQuery } });
      }

      // Fetch filtered and paginated data
      const [slots, total] = await Promise.all([
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

      return {
        data: slots,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      };
    },
  })
);
