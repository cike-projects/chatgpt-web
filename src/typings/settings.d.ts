declare namespace Settings {

  interface WalletInfo {
    totalValue?: number
    availableValue?: number
    availablePercentage?: number
  }

  interface MemberInfo {
    nickname?: string
    username?: string
    avatar?: string
    invitationCode?: string
  }

  interface BotInfo {
    avatar: string
    name: string
    desc: string
    botId: string
  }
}
