# ShopDeck Incentive Portal — Part 1: Login + Sheets fetch

Part 1 of the 3-part build:

1. **This part** — Google sign-in (restricted to `@shopdeck.com` / `@blitzscale.co`) and a client-side fetch of the 7 source Google Sheets, using the signed-in employee's own Google permissions.
2. Incentive calculation engine on top of the fetched data.
3. Final dashboard display / polish.

No backend: it's a static React app. Google Identity Services runs the sign-in and hands the browser an OAuth access token; that same token calls the Sheets API v4 directly from the browser. Because each sheet is shared with the `all@shopdeck.com` / `all@blitzscale.co` group addresses, any employee in one of those groups gets exactly the access (view or edit) their group has — the app doesn't need to replicate that logic itself.

## 1. Google Cloud setup (one-time, by whoever owns the Workspace's Cloud project)

1. In [Google Cloud Console](https://console.cloud.google.com/), pick or create a project under the Workspace account that owns both `shopdeck.com` and `blitzscale.co`.
2. **APIs & Services → Library** → enable the **Google Sheets API**.
3. **APIs & Services → OAuth consent screen**:
   - User type: **Internal** (this restricts sign-in to accounts in your Workspace, which is what covers both domains).
   - Add scope `.../auth/spreadsheets.readonly`.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Authorized JavaScript origins: add `http://localhost:5173` (for local dev) and your GitHub Pages URL once you know it, e.g. `https://<your-org>.github.io`.
   - No redirect URI is needed — the app uses Google's token-client popup flow, not a redirect.
   - Copy the generated **Client ID** (looks like `xxxx.apps.googleusercontent.com`).

## 2. Configure the 7 sheets

Edit `src/config/sheets.js` and replace each `PUT_SPREADSHEET_ID_HERE` with the real spreadsheet ID (the long string in the sheet's URL between `/d/` and `/edit`), and set `range` to the tab/range you want read (a bare tab name like `"Daily Plan"` reads everything used on that tab).

## 3. Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your Client ID into VITE_GOOGLE_CLIENT_ID
npm run dev
```

Open the printed localhost URL, sign in with a `@shopdeck.com` or `@blitzscale.co` account, and you should see each configured sheet's row count (or an error if that sheet id/range/access is wrong).

## 4. Push to GitHub and deploy via GitHub Pages

```bash
git init
git add -A
git commit -m "Part 1: Google login + Sheets fetch"
git branch -M main
git remote add origin <your-new-repo-url>
git push -u origin main
```

Then in the GitHub repo:

1. **Settings → Pages → Source**: choose **GitHub Actions**.
2. **Settings → Secrets and variables → Actions → New repository secret**: name `VITE_GOOGLE_CLIENT_ID`, value = your OAuth Client ID.
3. Push to `main` (or re-run the `Deploy to GitHub Pages` workflow) — it builds and publishes `dist/` automatically. The `deploy.yml` workflow is already included.
4. Once you have the live `https://<org>.github.io/<repo>/` URL, add it back into the OAuth client's **Authorized JavaScript origins** in Cloud Console (step 1.4) — Google will otherwise refuse the popup from that origin.

## Notes / things to sanity-check

- The domain check (`src/auth/googleAuth.js`, `ALLOWED_DOMAINS`) is a client-side convenience gate, not the real security boundary — the real boundary is still Google's own sharing permissions on each sheet. Don't rely on it alone if a sheet is ever accidentally shared wider than the two group addresses.
- `spreadsheets.readonly` scope is requested by default. If a later part needs the portal to *write* to a sheet, switch the scope in `googleAuth.js` to `https://www.googleapis.com/auth/spreadsheets` and re-consent.
- Each sheet fetch fails independently (`services/sheetsApi.js`) — one bad sheet ID or a sheet an employee lacks access to won't block the other six.
