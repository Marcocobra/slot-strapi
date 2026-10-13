/* Creates data only in config/env/test's local SQLite database. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

if (process.env.NODE_ENV !== 'test') throw new Error('Use NODE_ENV=test');
for (const key of ['DATABASE_URL', 'DATABASE_HOST', 'DO_SPACE_ACCESS_KEY', 'DO_SPACE_SECRET_KEY']) delete process.env[key];
for (const key of ['ADMIN_JWT_SECRET', 'API_TOKEN_SALT', 'TRANSFER_TOKEN_SALT', 'JWT_SECRET'])
  process.env[key] = crypto.randomBytes(32).toString('hex');
process.env.APP_KEYS = [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')].join(',');
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
const root = process.cwd();
const out = path.resolve(root, '../../verifica');
fs.mkdirSync(path.resolve(root, '.tmp/seo-test'), { recursive: true });
const dbFile = path.resolve(root, '.tmp/seo-test/data.db');
if (fs.existsSync(dbFile)) fs.renameSync(dbFile, path.resolve(root, `.tmp/seo-test/previous-${Date.now()}.db`));
const { createStrapi } = require('@strapi/strapi');
const app = createStrapi({ appDir: root, distDir: path.join(root, 'dist') });
const results = [];
async function check(name, action) { await action(); results.push({ name, pass: true }); console.log('OK:', name); }

async function main() {
  // Inspect configured destination before opening any database connection.
  assert.equal(app.config.get('database.connection.client'), 'sqlite');
  assert.equal(app.config.get('database.connection.connection.filename'), path.resolve(root, '.tmp/seo-test/data.db'));
  assert.equal(app.config.get('plugins.upload.config.provider'), 'local');
  await app.load();
  await check('17 schemi additivi: nessun attributo precedente modificato', async () => {
    const names = ['blog','guide','slot-provider','provider-page','live-statistic','live-games-post','poker','sport','casino','slot-review','guide-and-news-page','new-slot','news-and-preview','slot-content-page','privacy-policy','cookie-policy','terms-and-condition'];
    for (const name of names) {
      const file = `src/api/${name}/content-types/${name}/schema.json`;
      const before = JSON.parse(execFileSync('git', ['show', `b56b114aa0085f2916963051eaa59796962076e9:${file}`], { encoding: 'utf8' }));
      const after = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const [key, value] of Object.entries(before.attributes)) assert.deepEqual(after.attributes[key], value);
      for (const key of ['meta_title', 'meta_description']) assert.equal(after.attributes[key].required, undefined);
    }
  });
  await check('Content Manager: i due campi compaiono nel layout di modifica', async () => {
    for (const name of ['blog', 'guide', 'slot-provider', 'provider-page', 'page-seo']) {
      const config = await app.plugin('content-manager').service('content-types').findConfiguration(app.contentTypes[`api::${name}.${name}`]);
      for (const field of ['meta_title', 'meta_description']) {
        assert.equal(config.metadatas[field].edit.visible, true);
        assert.ok(JSON.stringify(config.layouts.edit).includes(field));
      }
    }
  });
  const media = await app.db.query('plugin::upload.file').create({ data: {
    name: 'seo-fixture.svg', hash: 'seo-fixture', ext: '.svg', mime: 'image/svg+xml', size: 1,
    url: '/placeholder.svg', provider: 'local', width: 100, height: 100,
  } });
  const run = Date.now().toString();
  const ids = {};
  async function seed(name, extra = {}, status = 'published') {
    const uid = `api::${name}.${name}`, attributes = app.contentTypes[uid].attributes;
    const data = {};
    for (const [key, attr] of Object.entries(attributes)) {
      if (attr.required && ['string','text','richtext'].includes(attr.type)) data[key] = `Fixture ${name}`;
      if (attr.required && attr.type === 'media') data[key] = media.id;
      if (attr.required && ['integer','decimal','float','biginteger'].includes(attr.type)) data[key] = 1;
      if (attr.required && attr.type === 'enumeration') data[key] = attr.enum[0];
      if (attr.type === 'uid') data[key] = `seo-${name}-${run}`;
    }
    if (attributes.title) data.title = `H1 ${name}`;
    if (attributes.description) data.description = `# Titolo nel corpo\n\nTesto informativo con un [link](https://example.test) e caratteri accentati.`;
    if (attributes.meta_title) data.meta_title = `SEO ${name} | Il COBRA`;
    if (attributes.meta_description) data.meta_description = `Descrizione SEO ${name}, già più chiara.`;
    Object.assign(data, extra);
    const item = await app.documents(uid).create({ data, status });
    ids[name] = item;
    return item;
  }
  const category = await seed('guide-and-news-page', { slug: 'guide' });
  for (const name of ['blog','guide','slot-provider','live-statistic','live-games-post','poker','sport','casino','slot-review']) {
    await seed(name, name === 'guide' ? { guide_and_news_page: category.documentId } : {});
  }
  const section = await seed('slot-content-page');
  const preview = await seed('news-and-preview');
  await seed('slot', { slot_content_page: section.documentId, news_and_preview: preview.documentId,
    meta_title: 'Big Bass Splash 1000 gratis | Cobra Slot', meta_description: 'RTP 96,52%, volatilità alta, max win 25.000x.' });
  for (const name of ['blog-and-news-page','guide-page','provider-page','new-slot','slot-page','casino-page','poker-page','sport-page','live-game','who-we-are','privacy-policy','cookie-policy','terms-and-condition','welcome-bonus-page']) await seed(name);
  const draft = await seed('blog', { slug: `seo-draft-${run}` }, 'draft');
  const blog = await app.documents('api::blog.blog').findFirst({ filters: { slug: `seo-blog-${run}` }, status: 'published' });
  ids.blog = blog;
  await seed('page-seo', { page_key: 'home', meta_title: 'Home SEO di prova', meta_description: 'Descrizione Home di prova.' });

  await check('salva i due campi senza cambiare titolo visibile o slug', async () => {
    await app.documents('api::blog.blog').update({ documentId: blog.documentId,
      data: { meta_title: 'Titolo SEO diverso dall’H1 | Il COBRA', meta_description: 'Descrizione manuale è più chiara.' } });
    const saved = await app.documents('api::blog.blog').findOne({ documentId: blog.documentId, status: 'draft' });
    assert.equal(saved.title, blog.title); assert.equal(saved.slug, blog.slug);
    assert.equal(saved.meta_title, 'Titolo SEO diverso dall’H1 | Il COBRA');
  });
  await check('salvare una bozza non modifica la versione pubblicata', async () => {
    const published = await app.documents('api::blog.blog').findOne({ documentId: blog.documentId, status: 'published' });
    assert.equal(published.meta_title, blog.meta_title);
  });
  await check('pubblica rende disponibili i nuovi campi', async () => {
    await app.documents('api::blog.blog').publish({ documentId: blog.documentId });
    const published = await app.documents('api::blog.blog').findOne({ documentId: blog.documentId, status: 'published' });
    assert.equal(published.meta_title, 'Titolo SEO diverso dall’H1 | Il COBRA');
    assert.equal(published.meta_description, 'Descrizione manuale è più chiara.');
  });

  // Only this disposable DB gets public read permissions for test fixtures.
  const publicRole = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  for (const name of [...Object.keys(ids).filter(n => n !== 'page-seo'), 'welcome-bonus','welcome-bonus-card','home-first-cta','home-second-cta','first-countdown-section','second-countdown-section','slot-theme','game-type','pop-up','search-bar-placeholder']) {
    for (const action of ['find','findOne']) await app.db.query('plugin::users-permissions.permission').create({
      data: { action: `api::${name}.${name}.${action}`, role: publicRole.id },
    });
  }
  const token = await app.admin.services['api-token'].create({ name: `seo-test-${run}`, type: 'custom',
    lifespan: 604800000, permissions: ['api::page-seo.page-seo.find'] });
  // Ephemeral local token: never print it, do not add it to a report or Git.
  fs.writeFileSync(path.resolve(root, '.tmp/seo-test/seo-read-token'), token.accessKey, { mode: 0o600 });
  app.server.use(async (ctx, next) => {
    // Test-only failure fixtures. This middleware is never part of production.
    if (ctx.path === '/api/blogs' && ctx.url.includes('seo-malformed')) { ctx.body = { data: [{ title: 'malformed' }] }; return; }
    if (ctx.path === '/api/blogs' && ctx.url.includes('seo-api-error')) { ctx.status = 503; ctx.body = { error: { message: 'fixture unavailable' } }; return; }
    await next();
  });
  await app.listen();
  const origin = 'http://127.0.0.1:1340';
  await check('REST: campi scalari presenti senza populate SEO aggiuntivo', async () => {
    const response = await fetch(`${origin}/api/blogs?filters[slug][$eq]=${blog.slug}&status=published`);
    assert.equal(response.status, 200); const payload = await response.json();
    assert.equal(payload.data[0].meta_title, 'Titolo SEO diverso dall’H1 | Il COBRA');
  });
  await check('REST pubblico esclude bozze e slugs assenti', async () => {
    for (const slug of [draft.slug, 'seo-non-esistente']) {
      const response = await fetch(`${origin}/api/blogs?filters[slug][$eq]=${slug}&status=published`);
      assert.deepEqual((await response.json()).data, []);
    }
  });
  await check('messaggi Contact e nuova raccolta SEO non diventano pubblici', async () => {
    assert.equal((await fetch(`${origin}/api/contacts`)).status, 403);
    assert.equal((await fetch(`${origin}/api/page-seos`)).status, 403);
    const response = await fetch(`${origin}/api/page-seos`, { headers: { Authorization: `Bearer ${token.accessKey}` } });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data[0].meta_title, 'Home SEO di prova');
  });
  await check('API pubbliche di scrittura restano chiuse', async () => {
    assert.equal((await fetch(`${origin}/api/blogs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"data":{"title":"no"}}' })).status, 403);
    assert.equal((await fetch(`${origin}/api/page-seos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 405);
  });
  fs.writeFileSync(path.join(out, 'backend-tests.json'), JSON.stringify({ database: '.tmp/seo-test/data.db', results }, null, 2));
  fs.writeFileSync(path.join(out, 'fixture-index.json'), JSON.stringify({
    blog: blog.slug, blogDocumentId: blog.documentId, draft: draft.slug,
    fixtures: Object.fromEntries(Object.entries(ids).map(([name,item]) => [name, { slug: item.slug, documentId: item.documentId }])),
    guide: ids.guide.slug, provider: ids['slot-provider'].slug, slot: ids.slot.slug,
    statistics: ids['live-statistic'].slug, section: section.slug, preview: preview.slug,
  }, null, 2));
  console.log(`TEST SUPERATI: ${results.length}. Strapi test in ascolto su 127.0.0.1:1340.`);
  if (!process.argv.includes('--serve')) await app.destroy();
}
main().catch(async error => { console.error(error.message); if (app.isLoaded) await app.destroy(); process.exitCode = 1; });
