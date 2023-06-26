<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'
import Announcement from '@/components/common/Announcement.vue'
import { fetchPublicBots } from '@/api'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
const showAnnouncement = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

const options = ref<any[]>([])

async function fetchAllPublicBots() {
  const { data } = await fetchPublicBots<Settings.BotInfo[]>()
  data.forEach((element, index) => options.value?.push({
    label: element.name,
    key: element.botId,
    avatar: element.avatar,
  }))
}

onMounted(() => {
  fetchAllPublicBots()
})

function handleAdd(botName: string, botId: string | null, avatar: string | null) {
  chatStore.addHistory({ botName, botId, avatar, title: 'New Chat', uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleSelect(key: string | number, option: DropdownOption) {
  handleAdd(option.label, key, option.avatar)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="static"
    bordered
    class="h-full"
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NSpace justify="space-between">
            <NButton dashed block @click="handleAdd('我超会的', null, null)">
              {{ $t('chat.newChatButton') }}
            </NButton>
            <n-dropdown :options="options" @select="handleSelect">
              <NButton class="dark:bg-green-600">
                +
              </NButton>
            </n-dropdown>
          </NSpace>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="p-4">
          <NSpace vertical>
            <NButton block @click="showAnnouncement = true">
              公告栏
            </NButton>
            <NButton block @click="show = true">
              {{ $t('store.siderButton') }}
            </NButton>
          </NSpace>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />
  <Announcement v-model:visible="showAnnouncement" />
</template>
