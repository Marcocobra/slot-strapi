'use strict';

const previousUid = 'api::page.page';
const nextUid = 'api::come-valutiamo.come-valutiamo';

module.exports = {
  async up(knex) {
    // Schema sync removes retired content types. Stop before it if an editor has
    // added content since the verified empty-table backup, including draft rows.
    if (await knex.schema.hasTable('pages')) {
      if (['pg', 'postgres', 'postgresql'].includes(knex.client.config.client)) {
        await knex.raw("SET LOCAL lock_timeout = '5s'");
        await knex.raw('LOCK TABLE ?? IN ACCESS EXCLUSIVE MODE', ['pages']);
      }
      const row = await knex('pages').count({ total: '*' }).first();
      if (Number(row.total) !== 0) {
        throw new Error('Pages contains content or drafts. Conversion stopped before schema sync; migrate that content before retrying.');
      }
      // Retire the empty table in this same transaction, closing the window for
      // a concurrent editor to insert a draft between this check and schema sync.
      await knex.schema.dropTable('pages');
    }

    // Preserve the existing readers and token scopes; never grant a new writer.
    for (const table of ['up_permissions', 'strapi_api_token_permissions']) {
      if (await knex.schema.hasTable(table)) {
        await knex(table)
          .whereIn('action', [`${previousUid}.find`, `${previousUid}.findOne`])
          .update({ action: `${nextUid}.find` });
      }
    }

    // Keep editor roles and conditions for the same content, removing only the
    // retired slug fields from their allowed field lists.
    if (await knex.schema.hasTable('admin_permissions')) {
      const permissions = await knex('admin_permissions').where({ subject: previousUid }).select('id', 'properties');
      for (const permission of permissions) {
        const properties = typeof permission.properties === 'string'
          ? JSON.parse(permission.properties)
          : permission.properties;
        if (Array.isArray(properties?.fields)) {
          properties.fields = properties.fields.filter(field => !['slug', 'published_slug'].includes(field));
        }
        await knex('admin_permissions').where({ id: permission.id }).update({
          subject: nextUid,
          properties: properties == null ? null : JSON.stringify(properties),
        });
      }
    }
  },
};
