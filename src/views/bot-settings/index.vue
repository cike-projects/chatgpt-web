<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import { fetchPublicBots } from '@/api'
import SelfSetting from '@/views/bot-settings/selfSetting.vue'

const loading = ref(false)

const bots = ref<Settings.BotInfo[]>()

async function fetchAllPublicBots() {
  try {
    const { data } = await fetchPublicBots<Settings.BotInfo[]>()
    bots.value = data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAllPublicBots()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <NH1>个人中心</NH1>
        <n-tabs type="line" animated>
          <n-tab-pane name="公共" tab="公共">
            <n-grid x-gap="20" :cols="5">
              <n-gi v-for="bot in bots" :key="bot.botId">
                <n-card>
                  <n-space>
                    <n-avatar
                      round
                      size="medium"
                      :src="bot.avatar"
                    />
                    <n-h3>{{ bot.name }}</n-h3>
                  </n-space>
                  {{ bot.desc }}
                  <!--              <n-space justify="space-between">-->
                  <!--                <n-button round size="tiny">-->
                  <!--                  圆角-->
                  <!--                </n-button>-->
                  <!--                <n-button size="tiny">-->
                  <!--                  使用-->
                  <!--                </n-button>-->
                  <!--              </n-space>-->
                </n-card>
              </n-gi>
            </n-grid>
          </n-tab-pane>
          <n-tab-pane name="我的" tab="我的">
            <SelfSetting />
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </NSpin>
</template>

<style scoped>

</style>
