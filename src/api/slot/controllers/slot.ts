import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::slot.slot",
  ({ strapi }) => ({
    async find(ctx) {
      const searchQuery =
        ctx.query.query?.toString().trim().toLowerCase() || '';
      const page = parseInt(
        (ctx.query["pagination[page]"] as string) || "1",
        10
      );
      const pageSize = parseInt(
        (ctx.query["pagination[pageSize]"] as string) || "10",
        10
      );
      const start = (page - 1) * pageSize;

<<<<<<< HEAD
      const fullData = await strapi.entityService.findMany("api::slot.slot", {
        populate: {
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
=======
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
>>>>>>> 2e7c2b88167dcf45bb29e8b82feb28571fa351e7
          },
        },
      };

<<<<<<< HEAD
      const filtered = fullData.filter((slot: any) => {
        const q = searchQuery.toLowerCase();
        const numericQuery = parseFloat(searchQuery.replace("%", ""));
        const isNumeric = !isNaN(numericQuery);
        const isRtpQuery = searchQuery.includes("%");
        const isVolatility = ["low", "medium", "high"].includes(q);

        return (
          slot.title?.toLowerCase().includes(q) ||
          (typeof slot.provider === "string" &&
            slot.provider.toLowerCase().includes(q)) ||
          slot.payline_system?.toLowerCase().includes(q) ||
          slot.slot_theme?.title?.toLowerCase().includes(q) ||
          (isVolatility && slot.volatility?.toLowerCase() === q) ||
          (isRtpQuery && Math.abs(slot.rtp - numericQuery) <= 0.5) ||
          (isNumeric && Math.abs(slot.rtp - numericQuery) <= 0.5)
        );
      });
=======
      // If no search query, return paginated results
      if (!searchQuery) {
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      }

      // Parse query for specific types
      const numericQuery = parseFloat(searchQuery.replace(/[^0-9.]/g, '')); // Extract numeric part
      const isNumeric = !isNaN(numericQuery);
      const isRtpQuery =
        searchQuery.includes('%') || searchQuery.includes('rtp');
      const isMaxWinQuery = searchQuery.toLowerCase().includes('x');
      const isVolatilityQuery = searchQuery.match(
        /(volatilità\s+)?(low|medium|high|alta|media|bassa)/i
      );
>>>>>>> 2e7c2b88167dcf45bb29e8b82feb28571fa351e7

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

      // Handle RTP query (e.g., "RTP 97%" or "97%")
      if (isRtpQuery && isNumeric && numericQuery >= 0 && numericQuery <= 100) {
        filters.$or.push({ rtp: { $eq: numericQuery } });
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
