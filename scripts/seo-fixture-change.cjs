const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
if (process.env.NODE_ENV !== 'test') throw new Error('Use NODE_ENV=test');
for (const key of ['DATABASE_URL','DATABASE_HOST','DO_SPACE_ACCESS_KEY','DO_SPACE_SECRET_KEY']) delete process.env[key];
for (const key of ['ADMIN_JWT_SECRET','API_TOKEN_SALT','TRANSFER_TOKEN_SALT','JWT_SECRET']) process.env[key] = crypto.randomBytes(32).toString('hex');
process.env.APP_KEYS = crypto.randomBytes(32).toString('hex');
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
const { createStrapi } = require('@strapi/strapi');
const app = createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') });
async function main() {
  assert.equal(app.config.get('database.connection.client'), 'sqlite');
  assert.equal(app.config.get('database.connection.connection.filename'), path.resolve('.tmp/seo-test/data.db'));
  await app.load();
  const mode = process.argv[2];
  if (mode === 'grant-reads') {
    const role = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    for (const name of ['welcome-bonus','welcome-bonus-card','home-first-cta','home-second-cta','first-countdown-section','second-countdown-section','slot-theme','game-type','pop-up','search-bar-placeholder']) {
      for (const verb of ['find','findOne']) {
        const action = `api::${name}.${name}.${verb}`;
        const existing = await app.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
        if (!existing) await app.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
      }
    }
  } else {
    const fixture = JSON.parse(fs.readFileSync(path.resolve('../../verifica/fixture-index.json'), 'utf8'));
    const service = app.documents('api::blog.blog');
    const modes = {
      'title-only': { meta_title: 'Solo titolo SEO è già completo | Il COBRA', meta_description: '' },
      'description-only': { meta_title: '', meta_description: 'Solo descrizione manuale, più chiara.' },
      empty: { meta_title: '', meta_description: '' },
      manual: { meta_title: 'Titolo SEO diverso dall’H1 | Il COBRA', meta_description: 'Descrizione manuale è più chiara.' },
      long: { meta_title: 'Titolo lungo è già completo | Il COBRA '+ 'testo '.repeat(25), meta_description: 'Descrizione lunga con accenti e 😊. '.repeat(25) },
    };
    if (mode === 'publish') await service.publish({ documentId: fixture.blogDocumentId });
    else {
      assert.ok(mode in modes, 'Unsupported fixture action');
      await service.update({ documentId: fixture.blogDocumentId, data: modes[mode] });
    }
  }
  console.log('Fixture locale aggiornata:', mode);
  await app.destroy();
}
main().catch(async error => { console.error(error.message); if (app.isLoaded) await app.destroy(); process.exitCode = 1; });
