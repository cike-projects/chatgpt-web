<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { fetchMemberWallet } from '@/api'

const walletInfo = ref<Settings.WalletInfo>({
  totalValue: 0,
  availableValue: 0,
  availablePercentage: 0,
})

async function fetchWalletInfo() {
  const { data } = await fetchMemberWallet<Settings.WalletInfo>()
  walletInfo.value = data
  if (walletInfo.value.availableValue === 0 || walletInfo.value.totalValue === 0) {
    walletInfo.value.availablePercentage = 0
  } else {
    walletInfo.value.availablePercentage = (walletInfo.value.availableValue / walletInfo.value.totalValue * 100).toFixed(0)
  }
}

onMounted(() => {
  fetchWalletInfo()
})
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="flex-1 min-w-0 ml-2">
      <NSpace vertical>
        <NSpace justify="space-between">
          <span>
            {{ walletInfo.availableValue }} ({{ walletInfo.availablePercentage }} %)
          </span>
          <NSpace>
            <NButton type="primary" text @click="fetchWalletInfo">
              刷新
            </NButton>
            <n-button
              text
              tag="a"
              href="#/user?id=Billing"
              type="primary"
            >
              管理
            </n-button>
          </NSpace>
        </NSpace>
        <n-progress
          type="line"
          :show-indicator="false"
          :percentage="walletInfo.availablePercentage"
        />
      </NSpace>
    </div>
  </div>
</template>
