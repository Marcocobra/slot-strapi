# Working on the COBRA backend

- Read `README.md` and the relevant CMS contract before changing a model or endpoint. The Come valutiamo contract is `docs/come-valutiamo.md`.
- Keep each change on a dedicated branch based on current `main`. DigitalOcean automatically deploys updates to `main`; a branch push is not a production deployment.
- Keep schema changes additive where possible. Preserve existing content types, fields, slugs and permissions unless the task explicitly changes them.
- Build before running integration scripts. Test only with isolated local databases and local uploads; never point fixture scripts at production.
- Before releasing a production schema change, obtain a fresh recoverable backup and verify the schema update on a restored PostgreSQL copy.
- Never commit credentials, `.env` files, database exports, production records or private verification artifacts. Keep shareable reports free of those contents.
- Come valutiamo is a single type with an explicit editorial date and a fixed public route; no CMS slug is needed. Do not expose drafts or add REST write methods to website endpoints.
- The conversion migration must refuse to retire a nonempty legacy Pages table, including drafts. Preserve existing readers and editor role conditions; do not add API writers.
- Update the relevant contract and generated types when behavior changes. Avoid duplicating operational instructions across new documents.
- Keep the final report precise about branch, commit, tests, production status and the work remaining for the frontend or editors.
