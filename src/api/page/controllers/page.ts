import { factories } from '@strapi/strapi';

// Website reads always return published content, including for authenticated tokens.
export default factories.createCoreController('api::page.page', () => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, status: 'published' };
    return super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query = { ...ctx.query, status: 'published' };
    return super.findOne(ctx);
  },
}));
