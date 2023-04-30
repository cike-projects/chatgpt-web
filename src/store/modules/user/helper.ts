import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar: string
  nickname: string
  description: string
}

export interface UserState {
  userInfo: UserInfo
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      avatar: 'https://th.bing.com/th/id/OIP.HiR_mWL7XXgvsG5xA0RByAHaHa?pid=ImgDet&rs=1',
      nickname: 'Unknown',
      description: 'Star on <a href="https://github.com/zhangyunan1994/ChattyAI" class="text-blue-500" target="_blank" >GitHub</a>',
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
