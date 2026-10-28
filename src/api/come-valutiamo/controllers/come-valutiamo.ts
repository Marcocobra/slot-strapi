import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::come-valutiamo.come-valutiamo', () => ({
  async find(ctx) {
    // Website reads cannot expose an unpublished editorial revision.
    ctx.query = { ...ctx.query, status: 'published' };
    return super.find(ctx);
  },
}));
