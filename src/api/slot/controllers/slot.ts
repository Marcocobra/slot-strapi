import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::slot.slot",
  ({ strapi }) => ({
    async find(ctx) {
      const searchQuery = ctx.query.query as string | undefined;

      if (!searchQuery) {
        return await super.find(ctx);
      }

      const page = parseInt(
        (ctx.query["pagination[page]"] as string) || "1",
        10
      );
      const pageSize = parseInt(
        (ctx.query["pagination[pageSize]"] as string) || "10",
        10
      );
      const start = (page - 1) * pageSize;

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
          },
        },
        limit: 2000,
      });

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

      const paginated = filtered.slice(start, start + pageSize);

      return {
        data: paginated,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(filtered.length / pageSize),
            total: filtered.length,
          },
        },
      };
    },
  })
);
