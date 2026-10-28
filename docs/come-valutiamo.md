# Come valutiamo single type

`Come valutiamo` is a dedicated Strapi single type, following the same CMS organization as Privacy, Cookie Policy and the other static pages. The team agreed this model on 28 October 2026; it replaces the generic `Pages` collection introduced on 27 October. The public website URL remains `/come-valutiamo`.

## CMS fields

| Field | Purpose |
| --- | --- |
| `title` | The visible H1. |
| `body` | Markdown rich text, supporting H2/H3 and internal links. It is a string, not Blocks JSON. |
| `meta_title` | Optional SEO title with a frontend fallback if empty. |
| `meta_description` | Optional meta description with an independent frontend fallback. |
| `last_updated` | The actual editorial review date, stored as `YYYY-MM-DD`. Required for publication, optional while drafting. |

These are the only five editorial fields. There is no `slug` or internal published-slug lock: the page has a fixed frontend route. `updatedAt` remains Strapi's technical timestamp and must not replace the displayed editorial review date.

Draft & Publish is enabled. Saving a draft does not change the published version, and the website API cannot read drafts, even when `status=draft` is requested explicitly.

## Frontend API contract for Anna

```text
GET /api/come-valutiamo
```

The successful response follows the standard Strapi 5 single-type format:

```json
{
  "data": {
    "documentId": "...",
    "title": "...",
    "body": "...",
    "meta_title": "...",
    "meta_description": "...",
    "last_updated": "2026-10-28"
  },
  "meta": {}
}
```

Read the fields directly from `data`, not `data[0]` or `data.attributes`. No slug filter, document-ID suffix or `populate` is required. Before the page is published, or after it is unpublished, an authorized reader receives HTTP 404. Treat missing content separately from a network/CMS failure.

`/api/pages` is retired. Change the frontend request to the new endpoint and single-object response. The frontend URL `/come-valutiamo` stays unchanged.

The migration retains existing read access from the retired model. Public read had been enabled in production before this conversion and is retained for published content only. Fresh installations remain closed unless read access is configured. Existing custom token read scopes are remapped to `api::come-valutiamo.come-valutiamo.find`; token values are not changed. If a new token is needed, use this single read scope and keep it server-side. REST create, update and delete methods are not registered; editors use Content Manager.

## Conversion safeguards

The dated migration runs before Strapi schema synchronization. It checks the legacy `pages` table, including drafts. If any rows exist, it stops before removing the old model or changing permissions. Inspect and migrate those records explicitly before retrying; do not bypass this guard.

On PostgreSQL the migration locks the legacy table, rechecks that it is empty, and retires it in the same transaction. This prevents an editor inserting a draft between the check and removal. Schema sync then creates the dedicated `come_valutiamos` table. Existing reader grants keep their original role/token associations. Editor permissions retain their role associations and conditions, with the retired slug fields removed. No new website write permission is granted.

Use the backup and release process in `README.md`. The migration has no automatic down operation; reverting model code is not a database recovery procedure. Backups and restored production data stay outside the repository.

## Editorial and website requirements

Joele supplies the agreed article and Alex reviews it before publication. Enter the approved text, SEO fields and actual review date through the **Single Types → Come valutiamo** entry. This change does not seed an article or invent an editorial date.

Anna owns the frontend implementation. The agreed requirements remain: the complete body visible in initial HTML, one H1, self-canonical `/come-valutiamo` without a trailing slash, indexing allowed, sitemap inclusion when published, a visible editorial date and `WebPage.dateModified` based on `last_updated`. Add “Come valutiamo le slot” to the footer's main links and near the verdict/rating in the slot review template. Verify publishing and cache refresh behavior on staging.

The backend supplies the CMS content and read API; the website rendering, footer, review links, sitemap and JSON-LD are integrated in the frontend repository.

## Local checks

Build first, then run `npm run test:come-valutiamo`. The suite uses only `.tmp/come-valutiamo-test/data.db`, local uploads and `127.0.0.1:1341`. It verifies the five-field single type, draft/publication behavior, date validation, response shape, permission migration, nonempty-table safeguard, idempotence and absence of website write methods. Run the existing SEO integration suite as a regression check.
