# COBRA Strapi backend

Strapi 5.12.6 backend for ilcobraslot.com. This repository contains CMS models and APIs; the production website frontend is maintained separately.

## Local development and checks

Use Node.js 22, which is the runtime used for the validated local checks. Install the locked dependencies with `npm ci`.

For ordinary development, configure a local `.env` using `.env.example`. Use a disposable local database and local uploads. Keep production credentials and database exports outside the repository.

The test environment explicitly selects local SQLite and local uploads:

```sh
NODE_ENV=test STRAPI_TELEMETRY_DISABLED=true npm run build
npm run test:pages
NODE_ENV=test node scripts/seo-integration.cjs
```

`test:pages` creates disposable fixtures only in `.tmp/page-test/data.db` and binds HTTP to `127.0.0.1:1341`. Its results are written to `.tmp/page-test/results.json`. The existing SEO integration suite uses `.tmp/seo-test/data.db` and port 1340. Both scripts reject a non-test environment and check the configured destination before loading Strapi. Build before running them so `dist` matches the source.

Regenerate schema types after changing content types:

```sh
NODE_ENV=test STRAPI_TELEMETRY_DISABLED=true npx strapi ts:generate-types
npx tsc --noEmit
```

## CMS contracts

- [Static pages and the Come valutiamo implementation](docs/content-pages.md): fields, editorial workflow, API access and the frontend integration contract.
- [Existing SEO integration](SEO-INTEGRAZIONE.md): metadata fields and the separate `page-seo` collection for existing page templates.

`Pages` stores complete static page content. `SEO pagine generali` stores metadata overrides for existing templates. Their purposes and permissions are separate.

## Changes and production releases

DigitalOcean App Platform builds `Marcocobra/slot-strapi` from `main` with automatic deployment enabled. A push to a feature branch provides reviewable code; updating `main` can change the live backend and synchronize its database schema.

Before a production schema release:

1. Review the complete diff against current `main`, including generated types. Run the relevant local tests and build.
2. Create a fresh production database backup with a matching row-count manifest, and verify a restore in an isolated database. Test schema synchronization against that restored PostgreSQL copy. Keep backup data and credentials private and outside Git.
3. Update `main` only within the release authorization. Observe the actual DigitalOcean deployment result, then verify public API responses and the website.

Do not treat a Git revert as a database recovery procedure: removing model fields can remove data. Preserve compatibility or coordinate a verified database restore with the code version. A restored backup excludes content created after its snapshot.

The repository contains no production content seeds or deployment credentials. Page content is entered in Content Manager after the relevant schema is deployed and the editorial draft is approved.
