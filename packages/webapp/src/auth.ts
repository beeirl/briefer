import { createClient } from '@openauthjs/openauth/client'

export namespace Auth {
  const client = createClient({
    clientID: 'react',
    issuer: import.meta.env.VITE_AUTH_URL,
  })

  let isInitialized = false
  let accessToken: string | undefined
  export let authenticated = false

  async function getToken() {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return
    const refreshed = await client.refresh(refresh, {
      access: accessToken,
    })
    if (refreshed.err) return logout()
    if (!refreshed.tokens) return accessToken
    accessToken = refreshed.tokens.access
    localStorage.setItem('refresh', refreshed.tokens.refresh)
    return refreshed.tokens.access
  }

  export async function init() {
    if (isInitialized) return
    const hash = new URLSearchParams(location.search.slice(1))
    const code = hash.get('code')
    const state = hash.get('state')
    if (code && state) {
      const challenge = JSON.parse(sessionStorage.getItem('challenge')!)
      if (state === challenge.state && challenge.verifier) {
        const exchanged = await client.exchange(code!, location.origin, challenge.verifier)
        if (!exchanged.err) {
          accessToken = exchanged.tokens?.access
          localStorage.setItem('refresh', exchanged.tokens.refresh)
        }
      }
      location.replace('/')
    } else {
      const token = await getToken()
      authenticated = !!token
    }
    isInitialized = true
  }

  export async function login(provider: 'code' | 'google') {
    const { challenge, url } = await client.authorize(location.origin, 'code', {
      pkce: true,
      provider,
    })
    sessionStorage.setItem('challenge', JSON.stringify(challenge))
    location.href = url
  }

  export async function logout() {
    accessToken = undefined
    authenticated = false
    localStorage.removeItem('refresh')
    location.replace('/auth')
  }

  export async function fetch(input: RequestInfo | URL, init?: RequestInit) {
    const token = await getToken()
    const response = await window.fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (response.status === 401) await logout()
    return response
  }
}
