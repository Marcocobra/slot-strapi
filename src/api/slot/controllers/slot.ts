/**
 * slot controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::slot.slot',
  ({ strapi }) => ({
    async find(ctx) {
      const searchQuery = ctx.query.query as string | undefined;

      const customQuery = { ...ctx.query };

      delete customQuery.query;

      ctx.query = customQuery;

      const { data, meta } = await super.find(ctx);

      if (searchQuery) {
        const filteredData = data.filter((item: any) => {
          const slot = item;

          const numericQuery = parseFloat(searchQuery);
          const isNumeric = !isNaN(numericQuery) && isFinite(numericQuery);

          const isRtpQuery = searchQuery.includes('%');

          const volatilityLevels = ['low', 'medium', 'high'];
          const isVolatilityQuery = volatilityLevels.includes(
            searchQuery.toLowerCase()
          );

          if (
            slot.title &&
            typeof slot.title === 'string' &&
            slot.title.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return true;
          }

          if (
            slot.provider &&
            typeof slot.provider === 'string' &&
            slot.provider.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return true;
          }

          if (isRtpQuery && slot.rtp && typeof slot.rtp === 'number') {
            const queryRtp = parseFloat(searchQuery.replace('%', ''));

            if (Math.abs(slot.rtp - queryRtp) <= 0.5) {
              return true;
            }
          }

          if (isNumeric && slot.rtp && typeof slot.rtp === 'number') {
            if (
              numericQuery >= 1 &&
              numericQuery <= 100 &&
              Math.abs(slot.rtp - numericQuery) <= 0.5
            ) {
              return true;
            }
          }

          if (
            isVolatilityQuery &&
            slot.volatility &&
            typeof slot.volatility === 'string' &&
            slot.volatility.toLowerCase() === searchQuery.toLowerCase()
          ) {
            return true;
          }

          if (
            slot.payline_system &&
            typeof slot.payline_system === 'string' &&
            slot.payline_system
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) {
            return true;
          }

          if (
            slot.slot_theme &&
            slot.slot_theme.title &&
            typeof slot.slot_theme.title === 'string' &&
            slot.slot_theme.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) {
            return true;
          }

          return false;
        });

        return {
          data: filteredData,
          meta: {
            ...meta,
            pagination: {
              ...meta.pagination,
              total: filteredData.length,
            },
          },
        };
      }

      return { data, meta };
    },
  })
);
