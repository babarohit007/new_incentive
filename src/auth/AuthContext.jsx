import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { fetchUserInfo, isAllowedDomain, requestAccessToken, revokeToken } from './googleAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { email, name, picture }
  const [accessToken, setAccessToken] = useState(null)
  const [status, setStatus] = useState('signed_out') // signed_out | signing_in | signed_in | error
  const [error, setError] = useState(null)

  const signIn = useCallback(async () => {
    setStatus('signing_in')
    setError(null)
    try {
      const tokenResponse = await requestAccessToken()
      const profile = await fetchUserInfo(tokenResponse.access_token)

      if (!isAllowedDomain(profile.email)) {
        revokeToken(tokenResponse.access_token)
        setStatus('error')
        setError(
          `${profile.email} isn't on an allowed domain. Sign in with a shopdeck.com or blitzscale.co account.`
        )
        return
      }

      setUser({ email: profile.email, name: profile.name, picture: profile.picture })
      setAccessToken(tokenResponse.access_token)
      setStatus('signed_in')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }, [])

  const signOut = useCallback(() => {
    revokeToken(accessToken)
    setUser(null)
    setAccessToken(null)
    setStatus('signed_out')
    setError(null)
  }, [accessToken])

  const value = useMemo(
    () => ({ user, accessToken, status, error, signIn, signOut }),
    [user, accessToken, status, error, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
