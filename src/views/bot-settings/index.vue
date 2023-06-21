<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicBots } from '@/api'
import { NSpin } from 'naive-ui'

const loading = ref(false)

const bots = ref<Settings.BotInfo[]>()

async function fetchAllPublicBots() {
  try {
    const { data } = await fetchPublicBots<Settings.BotInfo[]>()
    bots.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAllPublicBots()
})
</script>

<template>
  <NSpin :show="loading">
    <n-card title="歌曲" style="margin-bottom: 16px">
      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="Oasis">
          <n-grid x-gap="20" :cols="5">
            <n-gi v-for="bot in bots">
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
            <n-gi>
              <div class="green" />
            </n-gi>
            <n-gi>
              <div class="light-green" />
            </n-gi>
            <n-gi>
              <div class="green" />
            </n-gi>
          </n-grid>
        </n-tab-pane>
        <n-tab-pane name="zhangyunan" tab="张瑀楠">
          七里香
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </NSpin>
</template>

<style scoped>

</style>
