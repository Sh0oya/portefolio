# Auto-indexing setup (Google Indexing API + IndexNow)

Goal: new blog articles get pushed to Google (and Bing) automatically.

How it works: `api/index-ping.php` reads `sitemap.xml`, finds URLs it has not pinged
yet (state stored in `api/.index-state.json`), and notifies Google + IndexNow.
It pings each URL only once.

---

## 1. IndexNow (Bing / Copilot) — ready, nothing to create

Already in place:
- Key file at the root: `c3a91f7e6b2d48a5f0e1c8b4d7960a23.txt`
- Key in `api/config.php` (`indexnow_key`)

Just upload the files (step 4). No account needed.

---

## 2. Google Indexing API — one-time setup (~10 min)

1. **Google Cloud Console** (https://console.cloud.google.com):
   - Create a project (or reuse one).
   - APIs & Services → Library → enable **"Web Search Indexing API"**.
2. **Service account**:
   - IAM & Admin → Service Accounts → Create.
   - Name it e.g. `indexer`. No roles needed.
   - Open it → Keys → Add key → JSON → download the file.
   - Note its email, e.g. `indexer@your-project.iam.gserviceaccount.com`.
3. **Search Console** (https://search.google.com/search-console):
   - Settings → Users and permissions → Add user.
   - Paste the service-account email, role **Owner** (required, not just Full).
4. **Upload the JSON** as `/api/google-sa.json` (chmod 600).
   - The `.htaccess` in `/api/` blocks it from the web automatically.
   - If this file is absent, Google pings are skipped and only IndexNow runs.

---

## 3. The daily trigger (IONOS cron)

IONOS control panel → **Cron Jobs** → create a job:
- Command / URL:
  `curl -s "https://mathieuhaye.fr/api/index-ping.php?token=idxpg-R9mK2pQ7vX4nT"`
- Frequency: once a day (e.g. 08:30).

(Alternative: call that same URL at the end of your blog-generation routine, after upload.)

The `token` must match `index_ping_token` in `config.php`.

---

## 4. Upload to IONOS

- `c3a91f7e6b2d48a5f0e1c8b4d7960a23.txt`  → site root (chmod 644)
- `api/index-ping.php`                    → chmod 644
- `api/config.php`                        → chmod 600 (contains keys)
- `api/google-sa.json`                    → chmod 600 (after GCP setup)

The state file `api/.index-state.json` is created automatically on first run
(make sure `/api/` is writable by the web server, usually the case).

---

## 5. Test

Open in your browser (or curl):
`https://mathieuhaye.fr/api/index-ping.php?token=idxpg-R9mK2pQ7vX4nT`

Expected JSON:
```json
{
  "ok": true,
  "indexnow": { "status": "ok", "sent": 12 },
  "google":   { "status": "ok", "sent": 12, "pending": 0 },
  "totalUrls": 70
}
```
- `indexnow.status: ok` → Bing notified.
- `google.status: ok` → Google notified. If `auth_failed`, recheck the JSON / API enabled.
- `google.status: skipped` → no `google-sa.json` uploaded yet (IndexNow still works).

On the next runs, `sent` drops to 0 until a new article appears in the sitemap.

---

## Notes
- Google quota is ~200 URLs/day; the script caps at 50 per run (the first run
  pings the backlog over a couple of days, then it is 1 URL every 2 days).
- The Indexing API is officially for JobPosting/BroadcastEvent but works in
  practice for any page. It speeds up discovery; it is not a ranking lever.
- Keep submitting the sitemap in Search Console too (belt and braces).
- Rotate the keys (Brevo, Anthropic, this token) if they ever leak.
