import { useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { SHEET_SOURCES } from './config/sheets'
import { fetchAllSheets } from './services/sheetsApi'
import LoginScreen from './components/LoginScreen'
import DataPreview from './components/DataPreview'

export default function App() {
  const { user, accessToken, status, signOut } = useAuth()
  const [results, setResults] = useState(null)
  const [loadingSheets, setLoadingSheets] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (status !== 'signed_in' || !accessToken) return
    let cancelled = false
    setLoadingSheets(true)
    setLoadError(null)
    fetchAllSheets(accessToken, SHEET_SOURCES)
      .then((data) => {
        if (!cancelled) setResults(data)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingSheets(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, accessToken])

  if (status !== 'signed_in') {
    return <LoginScreen />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>ShopDeck Incentive Portal</h1>
          <p className="muted">Signed in as {user.email}</p>
        </div>
        <button className="link-btn" onClick={signOut}>
          Sign out
        </button>
      </header>

      {loadingSheets && <p>Loading sheet data…</p>}
      {loadError && <p className="error-text">{loadError}</p>}
      {results && <DataPreview results={results} />}
    </div>
  )
}
