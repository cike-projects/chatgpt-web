<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, h, reactive, ref, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore, SvgIcon } from '@/components/common'
import Announcement from '@/components/common/Announcement.vue'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
const showAnnouncement = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

const renderIcon = (icon: string) => {
  return () => {
    return h(SvgIcon, { icon })
  }
}

const options = reactive([
  {
    label: '使用下面的机器人创建会话',
    key: 'default',
    icon: renderIcon('ic:outline-tips-and-updates'),
    disabled: true,
  },
  {
    label: '暴躁老哥',
    key: '暴躁老哥',
    icon: renderIcon('ri:message-3-line'),
  },
  {
    label: 'Code 助手',
    key: 'Code 助手',
    icon: renderIcon('solar:code-bold-duotone'),
  },
])

function handleAdd(bot: string) {
  chatStore.addHistory({botName: bot, title: 'New Chat', uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleSelect(key: string) {
  handleAdd(key)
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
            <NButton dashed block @click="handleAdd('我超会的')">
              {{ $t('chat.newChatButton') }}
            </NButton>
            <n-dropdown :options="options" @select="handleSelect">
              <n-button class="dark:bg-green-600">+</n-button>
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
