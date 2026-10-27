// Disposable local data only. Does not accept a production database or cloud storage.
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
const directory = path.join(root, '.tmp/page-test');
fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
const database = path.join(directory, 'data.db');
if (fs.existsSync(database)) fs.renameSync(database, path.join(directory, `previous-${Date.now()}.db`));
const { createStrapi } = require('@strapi/strapi');
const app = createStrapi({ appDir: root, distDir: path.join(root, 'dist') });
app.config.set('database', { connection: { client: 'sqlite', connection: { filename: database }, useNullAsDefault: true } });
app.config.set('server.port', 1341);
const uid = 'api::page.page';
const results = [];
async function check(name, action) { await action(); results.push({ name, pass: true }); console.log('OK:', name); }

(async () => {
  assert.equal(app.config.get('database.connection.connection.filename'), database);
  assert.equal(app.config.get('database.connection.client'), 'sqlite');
  assert.equal(app.config.get('plugins.upload.config.provider'), 'local');
  await app.load();
  const pages = app.documents(uid);
  let page;
  const body = '## Who writes our reviews\n\nEditorial test.\n\n### Technical verification\n\nSee [Chi siamo](/chi-siamo) and [an example](/slot/example).';
  await check('All six editorial fields are editable and the internal URL lock is hidden', async () => {
    const config = await app.plugin('content-manager').service('content-types').findConfiguration(app.contentTypes[uid]);
    for (const field of ['title','slug','body','meta_title','meta_description','last_updated']) {
      assert.equal(config.metadatas[field].edit.visible, true);
      assert.ok(JSON.stringify(config.layouts.edit).includes(field));
    }
    assert.ok(!JSON.stringify(config.layouts.edit).includes('published_slug'));
  });
  await check('Editors can save a draft before setting the editorial date', async () => {
    page = await pages.create({ data: { title: 'Come valutiamo le slot', slug: 'come-valutiamo', body,
      meta_title: 'Come valutiamo le slot | Il COBRA', meta_description: 'Test methodology.' } });
    assert.equal(page.publishedAt, null);
  });
  await check('Publishing requires a deliberate editorial date', async () => {
    await assert.rejects(pages.publish({ documentId: page.documentId }), /last_updated/);
  });
  await pages.update({ documentId: page.documentId, data: { last_updated: '2026-10-27' } });
  await pages.publish({ documentId: page.documentId });
  await check('Published body preserves headings, internal links, metadata and date', async () => {
    const published = await pages.findOne({ documentId: page.documentId, status: 'published' });
    assert.equal(published.body, body);
    assert.equal(published.title, 'Come valutiamo le slot');
    assert.equal(published.slug, 'come-valutiamo');
    assert.equal(published.last_updated, '2026-10-27');
    assert.equal(published.meta_description, 'Test methodology.');
  });
  await check('A published URL cannot be renamed or unlocked through submitted data', async () => {
    await assert.rejects(pages.update({ documentId: page.documentId,
      data: { slug: 'new-url', published_slug: 'new-url' } }), /URL cannot be changed/);
    await pages.update({ documentId: page.documentId, data: { published_slug: 'new-url', meta_title: 'Technical edit' } });
    const saved = await pages.findOne({ documentId: page.documentId });
    assert.equal(saved.published_slug, 'come-valutiamo');
    assert.equal(saved.last_updated, '2026-10-27');
  });
  await pages.update({ documentId: page.documentId, data: { body: 'Unapproved draft text' } });
  const draft = await pages.create({ data: { title: 'Draft only', slug: 'draft-only', body: 'Private draft', last_updated: '2026-10-27' } });
  const token = await app.admin.services['api-token'].create({ name: `page-test-${Date.now()}`, type: 'custom',
    lifespan: 604800000, permissions: ['api::page.page.find', 'api::page.page.findOne'] });
  await app.listen();
  const origin = 'http://127.0.0.1:1341/api/pages';
  const headers = { Authorization: `Bearer ${token.accessKey}` };
  await check('Anonymous REST access remains closed', async () => {
    assert.equal((await fetch(origin)).status, 403);
  });
  await check('Restricted server token reads the published page without the private URL lock', async () => {
    const response = await fetch(`${origin}?filters[slug][$eq]=come-valutiamo`, { headers });
    assert.equal(response.status, 200);
    const data = (await response.json()).data;
    assert.equal(data.length, 1);
    assert.equal(data[0].body, body);
    assert.equal(data[0].last_updated, '2026-10-27');
    assert.equal(data[0].published_slug, undefined);
  });
  await check('Explicit draft queries cannot leak unpublished edits through the website API', async () => {
    const response = await fetch(`${origin}?status=draft&filters[slug][$eq]=come-valutiamo`, { headers });
    assert.equal((await response.json()).data[0].body, body);
    const empty = await fetch(`${origin}?status=draft&filters[slug][$eq]=draft-only`, { headers });
    assert.deepEqual((await empty.json()).data, []);
    assert.equal((await fetch(`${origin}/${draft.documentId}?status=draft`, { headers })).status, 404);
  });
  await check('Website REST endpoints provide no create, update or delete methods', async () => {
    for (const [method, url] of [['POST', origin], ['PUT', `${origin}/${page.documentId}`], ['DELETE', `${origin}/${page.documentId}`]]) {
      assert.equal((await fetch(url, { method, headers })).status, 405);
    }
  });
  await pages.unpublish({ documentId: page.documentId });
  await check('Unpublishing removes the website response and keeps the original URL locked', async () => {
    assert.equal((await fetch(`${origin}/${page.documentId}`, { headers })).status, 404);
    await assert.rejects(pages.update({ documentId: page.documentId, data: { slug: 'renamed-after-unpublish' } }), /URL cannot be changed/);
  });
  await check('Direct published creation also locks its URL', async () => {
    const item = await pages.create({ status: 'published', data: { title: 'Published directly', slug: 'published-directly', body, last_updated: '2026-10-27' } });
    await assert.rejects(pages.update({ documentId: item.documentId, data: { slug: 'renamed-directly' } }), /URL cannot be changed/);
  });
  fs.writeFileSync(path.join(directory, 'results.json'), JSON.stringify({ database: '.tmp/page-test/data.db', results }, null, 2) + '\n');
  console.log(`PAGE TESTS PASSED: ${results.length}`);
})().catch(error => { console.error(error.stack); process.exitCode = 1; })
  .finally(async () => { if (app.isLoaded) await app.destroy(); });
