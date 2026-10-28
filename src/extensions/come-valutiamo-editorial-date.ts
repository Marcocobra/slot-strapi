import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const uid = 'api::come-valutiamo.come-valutiamo' as const;

export function registerComeValutiamoEditorialDate(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== uid || !['create', 'update', 'publish'].includes(context.action)) {
      return next();
    }
    const params = context.params as {
      documentId?: string;
      status?: string;
      data?: Record<string, unknown>;
    };
    if (context.action === 'publish' || params.status === 'published') {
      const draft = params.documentId
        ? await strapi.db.query(uid).findOne({
            where: { documentId: params.documentId, publishedAt: null },
            select: ['last_updated'],
          })
        : null;
      if (!{ ...draft, ...params.data }.last_updated) {
        throw new errors.ValidationError('Set last_updated before publishing Come valutiamo.');
      }
    }
    return next();
  });
}
