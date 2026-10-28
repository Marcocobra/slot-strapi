// Uses disposable local data only. No production credentials or cloud uploads.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
if (process.env.NODE_ENV !== 'test') throw new Error('Use NODE_ENV=test');
process.umask(0o077);
for (const key of Object.keys(process.env)) if (/^(DATABASE_|PG|DO_SPACE_)/.test(key)) delete process.env[key];
for (const key of ['ADMIN_JWT_SECRET','API_TOKEN_SALT','TRANSFER_TOKEN_SALT','JWT_SECRET']) process.env[key] = crypto.randomBytes(32).toString('hex');
process.env.APP_KEYS = crypto.randomBytes(32).toString('hex');
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
const root = process.cwd();
const directory = path.join(root, '.tmp/come-valutiamo-test');
fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
const database = path.join(directory, 'data.db');
if (fs.existsSync(database)) fs.renameSync(database, path.join(directory, `previous-${Date.now()}.db`));
const { createStrapi } = require('@strapi/strapi');
const app = createStrapi({ appDir: root, distDir: path.join(root, 'dist') });
app.config.set('database', { connection: { client: 'sqlite', connection: { filename: database }, useNullAsDefault: true } });
app.config.set('server.port', 1341);
const uid = 'api::come-valutiamo.come-valutiamo';
const previousUid = 'api::page.page';
const migration = require('../database/migrations/2026.10.28T00.00.00.pages-to-come-valutiamo');
const results = [];
async function check(name, action) { await action(); results.push({ name, pass: true }); console.log('OK:', name); }

(async () => {
  assert.equal(app.config.get('database.connection.connection.filename'), database);
  assert.equal(app.config.get('plugins.upload.config.provider'), 'local');
  await app.load();
  await app.listen();
  const documents = app.documents(uid);
  const service = app.service(uid);
  const knex = app.db.connection;
  const endpoint = 'http://127.0.0.1:1341/api/come-valutiamo';
  const body = '## Authors\n\nEditorial fixture.\n\n### Verification\n\nSee [Chi siamo](/chi-siamo).';
  const token = await app.admin.services['api-token'].create({ name: `single-test-${Date.now()}`, type: 'custom',
    lifespan: 604800000, permissions: [`${uid}.find`] });
  const headers = { Authorization: `Bearer ${token.accessKey}` };

  await check('Come valutiamo is a single type with exactly the five agreed fields', async () => {
    assert.equal(app.contentTypes[uid].kind, 'singleType');
    assert.equal(app.contentTypes[uid].info.displayName, 'Come valutiamo');
    assert.equal(app.contentTypes[previousUid], undefined);
    const schema = JSON.parse(fs.readFileSync(path.join(root, 'src/api/come-valutiamo/content-types/come-valutiamo/schema.json')));
    assert.deepEqual(Object.keys(schema.attributes).sort(), ['body','last_updated','meta_description','meta_title','title']);
    const config = await app.plugin('content-manager').service('content-types').findConfiguration(app.contentTypes[uid]);
    for (const field of Object.keys(schema.attributes)) {
      assert.equal(config.metadatas[field].edit.visible, true);
      assert.ok(JSON.stringify(config.layouts.edit).includes(field));
    }
  });
  await check('A fresh installation does not open anonymous access', async () => {
    assert.equal((await fetch(endpoint)).status, 403);
    assert.equal((await fetch(endpoint, { headers })).status, 404);
  });

  const publicRole = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  const legacyRead = await app.db.query('plugin::users-permissions.permission').create({
    data: { action: `${previousUid}.find`, role: publicRole.id } });
  const legacyTokenRead = await app.db.query('admin::api-token-permission').create({
    data: { action: `${previousUid}.findOne`, token: token.id } });
  const legacyEditor = await app.db.query('admin::permission').create({ data: {
    action: 'plugin::content-manager.explorer.read', subject: previousUid,
    properties: { fields: ['title','slug','body','meta_title','meta_description','last_updated','published_slug'] }, conditions: [],
  } });
  await knex.schema.createTable('pages', table => { table.increments('id'); table.text('body'); });
  await knex('pages').insert({ body: 'An editor added a draft after the backup' });
  await check('Conversion stops before changing anything if legacy content or drafts exist', async () => {
    await assert.rejects(knex.transaction(trx => migration.up(trx)), /Pages contains content or drafts/);
    assert.equal(Number((await knex('pages').count({ total: '*' }).first()).total), 1);
    assert.equal((await knex('up_permissions').where({ id: legacyRead.id }).first()).action, `${previousUid}.find`);
    assert.equal((await knex('admin_permissions').where({ id: legacyEditor.id }).first()).subject, previousUid);
  });
  await knex('pages').del();
  const roleLinks = await knex('up_permissions_role_lnk').orderBy('id');
  const tokenLinks = await knex('strapi_api_token_permissions_token_lnk').orderBy('id');
  await knex.transaction(trx => migration.up(trx));
  await check('Only existing reader grants and editor field scopes move to the replacement type', async () => {
    assert.equal((await knex('up_permissions').where({ id: legacyRead.id }).first()).action, `${uid}.find`);
    assert.equal((await knex('strapi_api_token_permissions').where({ id: legacyTokenRead.id }).first()).action, `${uid}.find`);
    assert.deepEqual(await knex('up_permissions_role_lnk').orderBy('id'), roleLinks);
    assert.deepEqual(await knex('strapi_api_token_permissions_token_lnk').orderBy('id'), tokenLinks);
    const editor = await knex('admin_permissions').where({ id: legacyEditor.id }).first();
    assert.equal(editor.subject, uid);
    const properties = typeof editor.properties === 'string' ? JSON.parse(editor.properties) : editor.properties;
    assert.deepEqual(properties.fields, ['title','body','meta_title','meta_description','last_updated']);
    assert.equal((await fetch(endpoint)).status, 404);
  });
  await check('The conversion is idempotent', async () => {
    const before = await knex('up_permissions').orderBy('id');
    await knex.transaction(trx => migration.up(trx));
    assert.deepEqual(await knex('up_permissions').orderBy('id'), before);
  });
  assert.equal(await knex.schema.hasTable('pages'), false);

  let draft;
  await check('The single page saves as a draft and subsequent saves update the same document', async () => {
    draft = await service.createOrUpdate({ status: 'draft', data: { title: 'Come valutiamo le slot', body,
      meta_title: 'Come valutiamo | Il COBRA', meta_description: 'Editorial methodology fixture.' } });
    const updated = await service.createOrUpdate({ status: 'draft', data: { title: 'Come valutiamo le slot' } });
    assert.equal(updated.documentId, draft.documentId);
    assert.equal(new Set((await documents.findMany()).map(row => row.documentId)).size, 1);
    assert.equal((await fetch(endpoint)).status, 404);
  });
  await check('Publication requires an explicit editorial date', async () => {
    await assert.rejects(documents.publish({ documentId: draft.documentId }), /last_updated/);
    await service.createOrUpdate({ status: 'draft', data: { last_updated: '2026-10-28' } });
    await documents.publish({ documentId: draft.documentId });
  });
  await check('The published API returns a single object with headings, links, metadata and date', async () => {
    const response = await fetch(endpoint);
    assert.equal(response.status, 200);
    const data = (await response.json()).data;
    assert.equal(Array.isArray(data), false);
    assert.equal(data.title, 'Come valutiamo le slot');
    assert.equal(data.body, body);
    assert.equal(data.meta_title, 'Come valutiamo | Il COBRA');
    assert.equal(data.meta_description, 'Editorial methodology fixture.');
    assert.equal(data.last_updated, '2026-10-28');
    assert.equal(data.slug, undefined);
    assert.equal(data.published_slug, undefined);
  });
  await service.createOrUpdate({ status: 'draft', data: { body: 'Unapproved draft revision', meta_title: 'Draft SEO title' } });
  await check('Technical edits preserve the editorial date and explicit draft requests never leak revisions', async () => {
    const saved = await documents.findOne({ documentId: draft.documentId, status: 'draft' });
    assert.equal(saved.last_updated, '2026-10-28');
    for (const requestHeaders of [{}, headers]) {
      const data = (await (await fetch(`${endpoint}?status=draft`, { headers: requestHeaders })).json()).data;
      assert.equal(data.body, body);
      assert.equal(data.meta_title, 'Come valutiamo | Il COBRA');
    }
  });
  await check('The retired collection route is gone and the single endpoint has no REST writes', async () => {
    assert.equal((await fetch('http://127.0.0.1:1341/api/pages')).status, 404);
    for (const method of ['POST','PUT','DELETE']) assert.equal((await fetch(endpoint, { method, headers })).status, 405);
    assert.equal((await fetch(`${endpoint}/${draft.documentId}`, { headers })).status, 404);
  });
  await check('Clearing the date cannot publish an incomplete editorial revision', async () => {
    await service.createOrUpdate({ status: 'draft', data: { last_updated: null } });
    await assert.rejects(documents.publish({ documentId: draft.documentId }), /last_updated/);
    assert.equal((await (await fetch(endpoint)).json()).data.body, body);
  });
  await check('Unpublishing removes the website content while keeping the draft', async () => {
    await documents.unpublish({ documentId: draft.documentId });
    assert.equal((await fetch(endpoint)).status, 404);
    assert.ok(await documents.findOne({ documentId: draft.documentId, status: 'draft' }));
  });
  fs.writeFileSync(path.join(directory, 'results.json'), JSON.stringify({ database: '.tmp/come-valutiamo-test/data.db', results }, null, 2) + '\n');
  console.log(`COME VALUTIAMO CHECKS PASSED: ${results.length}`);
})().catch(error => { console.error(error.stack); process.exitCode = 1; })
  .finally(async () => { if (app.isLoaded) await app.destroy(); });
