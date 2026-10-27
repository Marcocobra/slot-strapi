import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const uid = 'api::page.page' as const;

/** Preserve published URLs and require a deliberate editorial date at publication. */
export function registerPageEditorialGuards(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== uid || !['create', 'update', 'publish'].includes(context.action)) {
      return next();
    }

    const params = context.params as {
      documentId?: string;
      status?: string;
      data?: Record<string, unknown>;
    };

    return strapi.db.transaction(async () => {
      const current = params.documentId
        ? await strapi.db.query(uid).findOne({
            where: { documentId: params.documentId, publishedAt: null },
          })
        : null;
      const lockedSlug = current?.published_slug;
      if (params.data) {
        // The lock is maintained by the server, never by a form or API caller.
        delete params.data.published_slug;
        if (lockedSlug && params.data.slug !== undefined && params.data.slug !== lockedSlug) {
          throw new errors.ValidationError('A published page URL cannot be changed, including after unpublishing.');
        }
      }

      const publishing = context.action === 'publish' || params.status === 'published';
      const candidate = { ...current, ...params.data };
      if (publishing && !candidate.last_updated) {
        throw new errors.ValidationError('Set the editorial last_updated date before publishing this page.');
      }
      if (publishing && lockedSlug && candidate.slug !== lockedSlug) {
        throw new errors.ValidationError('The page slug must match its first published URL.');
      }

      const result = await next();
      if (publishing) {
        const output = result as unknown as {
          documentId?: string;
          slug?: string;
          entries?: Array<{ documentId: string; slug: string }>;
        };
        const published = output.entries?.[0] || output;
        if (published.documentId && published.slug) {
          await strapi.db.query(uid).updateMany({
            where: { documentId: published.documentId },
            data: { published_slug: lockedSlug || published.slug },
          });
        }
      }
      return result;
    });
  });
}
