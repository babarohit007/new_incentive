// Calls to the Sheets API v4 REST endpoint directly from the browser,
// authenticated with the signed-in user's own OAuth access token. Google
// resolves access the same way it would in the Sheets UI: since each sheet
// is shared with all@shopdeck.com / all@blitzscale.co, any employee who's a
// member of the relevant group gets the same view/edit result here.

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

async function fetchOne(accessToken, { key, label, spreadsheetId, range }) {
  const url = `${BASE_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}`
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const message = body?.error?.message || `HTTP ${res.status}`
      return { key, label, ok: false, error: message, values: [] }
    }
    const data = await res.json()
    return { key, label, ok: true, error: null, values: data.values || [] }
  } catch (err) {
    return { key, label, ok: false, error: err.message, values: [] }
  }
}

// Fetches every configured sheet in parallel. A failure on one sheet
// (missing access, bad id, wrong range) never blocks the others — each
// result carries its own ok/error so the UI can show exactly what's wrong.
export async function fetchAllSheets(accessToken, sources) {
  return Promise.all(sources.map((source) => fetchOne(accessToken, source)))
}
