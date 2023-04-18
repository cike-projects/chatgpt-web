import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'
import { fetchSession } from '@/api'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  isLoggedIn: boolean
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    isLoggedIn: getToken() != null,
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      // return state.session?.model === 'ChatGPTAPI'
      return true
    },
  },

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    loginSuccess(token: string) {
      this.token = token
      this.isLoggedIn = true
      this.session = { auth: true, model: 'ChatGPTAPI' }
      setToken(token)
    },

    logout() {
      this.token = undefined
      removeToken()
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
