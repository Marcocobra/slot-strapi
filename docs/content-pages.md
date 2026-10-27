# Static pages and Come valutiamo

The `Pages` collection manages complete static pages, starting with B8, Come valutiamo le slot. Existing Privacy, Cookie Policy, Terms and Chi siamo models are separate single types; no generic page collection existed when this feature was prepared. Their data and existing endpoints remain in their original models.

## Fields and editorial behavior

| Field | Purpose |
| --- | --- |
| `title` | Visible H1. Keep separate from the SEO title. |
| `slug` | Page identifier without leading or trailing slashes. Set B8 to exactly `come-valutiamo` before first publication. |
| `body` | Markdown rich text with H2, H3 and internal links. This is a string, not Strapi Blocks JSON. |
| `meta_title` | Optional SEO title; frontend provides a fallback if empty. |
| `meta_description` | Optional meta description; frontend provides an independent fallback if empty. |
| `last_updated` | Editorial review date, formatted `YYYY-MM-DD`. Required at publication, optional while drafting. |

`updatedAt` is Strapi's technical timestamp. A metadata save must not silently change the displayed editorial review date. Editors update `last_updated` when they actually review or materially revise the page.

Draft & Publish is enabled. The first publication also records an internal `published_slug` value. That field is maintained by the server, excluded from website responses and the editing form, and prevents a later URL rename even after unpublishing. Do not delete and recreate a published page to bypass that protection; a URL change would require a separate redirect and link migration plan.

## Website API contract

The read-only endpoints are:

```text
GET /api/pages?filters[slug][$eq]=come-valutiamo&status=published
GET /api/pages/:documentId
```

The list response follows Strapi 5: fields appear directly in `data[0]`, with no `attributes` wrapper. No `populate` is required for these scalar fields. No matching published page produces an empty `data` array; a missing or unpublished document ID returns 404. A network or CMS error must not be treated as an empty successful result.

Both controllers force `status=published`, including if a client explicitly requests drafts. Draft previews, if added later, need a separate authenticated design; changing this website endpoint to serve drafts would weaken the current contract. REST create, update and delete methods are not registered. Content Manager remains the editing interface.

Anonymous access stays closed. Configure a dedicated server-only API token with `api::page.page.find` for the slug lookup. Add `api::page.page.findOne` only if the frontend actually uses the document-ID endpoint. A possible frontend environment variable is `STRAPI_PAGES_READ_TOKEN`; never use a `NEXT_PUBLIC_` prefix. Existing tokens for `page-seo` do not automatically gain permissions for `page`.

## B8 content workflow

1. Deploy the backend schema after the backup and release checks in the README. Confirm that `Pages` appears in Content Manager. If an editor is not a Super Admin, configure that editor's existing role for this content type as appropriate.
2. Joele prepares approximately 800–1,000 words and sends the draft to Alex for review. No draft article is seeded by this backend change.
3. After approval, create the page with `slug=come-valutiamo`, the approved H1, body, SEO metadata and the actual editorial review date. Save as draft until the agreed publication time.
4. Anna integrates the page on the actual production frontend and tests it on staging. Coordinate content publication with the frontend release.

The body follows the agreed brief: authorship, technical verification of RTP/volatility/max win/features, demo testing, update frequency, affiliate disclosure, responsible gambling and the approved ADM/18+ wording. Include the agreed author or Chi siamo link and 3–4 relevant Pragmatic Play review examples. Joele and Alex own these editorial decisions.

## Frontend acceptance criteria for Anna

- The public route is exactly `/come-valutiamo`, with no trailing slash, a self-canonical URL, indexing allowed and an entry in the sitemap once published.
- Fetch the published record on the server. The initial HTML must contain the complete page body through SSR or SSG. Render a single H1 from `title` and render Markdown headings and links with the frontend's safe Markdown renderer.
- Apply `meta_title` and `meta_description` independently. Preserve useful fallbacks when a manual field is empty.
- Display `last_updated` and use the same source for `WebPage.dateModified`. Format the date without shifting it across time zones.
- Add the anchor `Come valutiamo le slot` to the footer's main links and to the slot review template near the verdict or rating. A sidebar link alone does not meet the brief.
- Use a real missing-content response for an unpublished or absent record. Ensure publishing a revision refreshes the page's cache and sitemap according to the production frontend's rendering strategy.

These are frontend acceptance criteria, not features installed by adding the CMS model. The backend repository does not publish the website route, footer, review links, sitemap or JSON-LD.

## Verification

Run `npm run test:pages` after building in the local test environment. It covers the editing layout, draft and publication behavior, editorial date, URL protection, restricted token reads, draft exclusion and missing REST write methods. Keep production backup and migration evidence outside this public repository.
