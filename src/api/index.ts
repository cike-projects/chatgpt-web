import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchMemberInfo<T = any>() {
  return get<T>({
    url: '/member/info',
  })
}

export function modifyMemberInfo<T = any>(avatar: string, nickname: string) {
  return post<T>({
    url: '/member/info',
    data: {
      avatar,
      nickname,
    },
  })
}

export function fetchMemberInvitation<T = any>(currentPage: number, pageSize: number) {
  return get<T>({
    url: '/member/invitationRecord',
    data: {
      currentPage,
      pageSize,
    },
  })
}

export function fetchMemberWallet<T = any>() {
  return get<T>({
    url: '/member/wallet',
  })
}

export function fetchMemberWalletRecord<T = any>(currentPage: number, pageSize: number) {
  return get<T>({
    url: '/member/wallet/record',
    data: {
      currentPage,
      pageSize,
    },
  })
}

export function memberModifyPwd<T = any>(oldPassword: string, newPassword: string) {
  return post<T>({
    url: '/member/modifyPwd',
    data: {
      newPassword,
      oldPassword,
    },
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    conversationId: string | number | null
    botId: string | null | undefined
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    conversationId: params.conversationId,
    botId: params.botId,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
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
    url: '/auth/login/withPassword',
    data: {
      username,
      password,
    },
  })
}

export function authSignup<T>(username: string, password: string, email: string, invitationCode?: string | null) {
  return post<T>({
    url: '/auth/signup',
    data: {
      username,
      password,
      email,
      invitationCode,
    },
  })
}

export function checkToken<T>() {
  return get<T>({
    url: '/auth/checkToken',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function fetchPublicBots<T = any>() {
  return get<T>({
    url: '/bot/publicBot',
  })
}
