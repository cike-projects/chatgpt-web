import { defineStore } from 'pinia'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

import { checkToken } from '@/api'

interface CurrentUserInfo {
  nickname: string
  avatar: string
  description: string | null
}

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    async getUserInfo() {
      try {
        const { data } = await checkToken<CurrentUserInfo>()
        this.userInfo = {
          avatar: data.avatar,
          nickname: data.nickname,
          description: data.description ?? '',
        }
        return Promise.resolve(data)
      }
      catch (error) {
        this.userInfo = getLocalState().userInfo
        return Promise.reject(error)
      }
    },

    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
