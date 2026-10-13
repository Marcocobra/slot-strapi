# Integrazione dei campi SEO in Strapi

13 ottobre 2026. Proposta per Strapi 5.12.6, basata sul commit `b56b114aa0085f2916963051eaa59796962076e9` di `Marcocobra/slot-strapi`. Il branch `codex/seo-local-2026-10-13` è destinato alla revisione. La pubblicazione del branch non attiva i campi nel CMS online: serve un successivo rilascio del backend, da collaudare prima su un database separato.

## Campi aggiunti

I campi scalari opzionali sono `meta_title` di tipo string e `meta_description` di tipo text. Sono stati aggiunti soltanto quelli mancanti nei seguenti 17 modelli:

`blog`, `guide`, `slot-provider`, `provider-page`, `live-statistic`, `live-games-post`, `poker`, `sport`, `casino`, `slot-review`, `guide-and-news-page`, `new-slot`, `news-and-preview`, `slot-content-page`, `privacy-policy`, `cookie-policy`, `terms-and-condition`.

Gli attributi, gli slug, le relazioni e i campi SEO già presenti sono conservati. I tipi TypeScript sono aggiornati. Non ci sono aggiornamenti di dipendenze o script di migrazione dei dati reali.

## SEO delle pagine generali

La nuova raccolta `page-seo` contiene `page_key`, `meta_title` e `meta_description`, con bozze e pubblicazione. Le chiavi ammesse sono `home`, `contact`, `casinoLive`, `previews`, `guideHub`, `reviewHub`.

La route REST espone solo `find`. Il codice non apre permessi Public. Il frontend deve usare dal server un token limitato a `api::page-seo.page-seo.find`, configurato nel gestore dei segreti dell'hosting. Le bozze devono restare escluse dalle pagine pubbliche. La raccolta è separata dai messaggi Contact.

Esempio di lettura della versione pubblicata:

```text
GET /api/page-seos?filters[page_key][$eq]=home&fields[0]=meta_title&fields[1]=meta_description&status=published
Authorization: Bearer <token di sola lettura, conservato sul server>
```

Per gli altri modelli usare i campi scalari nella risposta REST Strapi 5. Se una query applica `fields`, includere entrambi i campi. Non serve un `populate` per questi campi scalari.

## Contratto con il frontend

Il titolo manuale è completo e non riceve un altro suffisso brand. Titolo e description hanno fallback indipendenti quando il rispettivo valore è vuoto. I valori manuali non vengono troncati automaticamente. Title HTML, Open Graph e Twitter devono essere coerenti.

La lettura dei campi non deve cambiare H1, corpo del contenuto, slug, immagini, canonical o policy robots. Conservare i noindex delle anteprime. Salvare una bozza non cambia la pagina pubblica; pubblicare deve aggiornare la versione servita secondo la strategia di cache verificata nel frontend reale.

## Test locali del backend

Usare Node 22 e il lockfile del repository:

```sh
npm ci --no-audit --no-fund
NODE_ENV=test STRAPI_TELEMETRY_DISABLED=true npm run build
npx tsc --noEmit
NODE_ENV=test STRAPI_TELEMETRY_DISABLED=true node scripts/seo-integration.cjs
```

La configurazione `test` impone SQLite in `.tmp/seo-test/data.db`, upload locali e host `127.0.0.1:1340`. Lo script controlla la destinazione prima di caricare Strapi e crea solo fixture artificiali. Con `--serve` mantiene il backend disponibile per i test del frontend. Gli esiti vengono scritti nella cartella `verifica` due livelli sopra il repository.

I nove controlli verificano schema additivo, layout Content Manager, salva/pubblica, REST, esclusione delle bozze e permessi. Il confronto degli schemi usa la base originale esplicita anche dopo la creazione del commit.

## Condizioni per un rilascio successivo

DigitalOcean indica il repository corrente, branch `main`, autodeploy attivo e un errore di autenticazione GitHub. Risolvere il collegamento GitHub prima di programmare il rilascio. Il branch di revisione deve restare separato da `main` durante il collaudo.

Il database di produzione è PostgreSQL; il test locale usa SQLite. Provare quindi l'avvio e l'aggiornamento additivo degli schemi su PostgreSQL separato, con una copia protetta e appropriata dei dati, prima del rilascio. Verificare il layout editoriale e i permessi dei ruoli usati realmente.

Prima di distribuire fare un backup verificato del database e registrare il deployment precedente. Un ripristino del vecchio codice può modificare lo schema gestito da Strapi: non affidarsi al solo revert Git per conservare i nuovi valori. Concordare e provare il ripristino del database, oppure un rollback compatibile che mantenga i campi. Nessuna di queste operazioni sulla produzione è compresa nella consegna del branch.
