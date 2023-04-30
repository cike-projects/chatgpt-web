import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchBillingUsage<T>() {
  return get<T>({
    url: '/dashboard/billing/usage',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    roomId: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    roomId: params.roomId,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
      useContext: settingStore.useContext,
    }
  }

  return post<T>({
    url: '/chat/stream',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function authLogin<T>(username: string, password: string) {
  return post<T>({
    url: 'auth/login/withPassword',
    data: {
      username,
      password,
    },
  })
}

export function checkToken<T>() {
  return get<T>({
    url: 'auth/checkToken',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
