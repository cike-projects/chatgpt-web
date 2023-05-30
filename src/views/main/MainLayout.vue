<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { SvgIcon } from '@/components/common'
import { useAppStore } from '@/store'
import SimpleUserAvatar from '@/components/common/SimpleUserAvatar.vue'
import SettingButton from '@/components/common/SettingButton.vue'

const message = useMessage()

const appStore = useAppStore()
const { isMobile } = useBasicLayout()
const collapsed = computed(() => appStore.siderCollapsed)

const router = useRouter()
const gotoRoute = function (route_name: string) {
  if (router.currentRoute.value.name === route_name)
    return
  router.push({ name: route_name })
}

const chatColor = computed(() => {
  if (router.currentRoute.value.name === 'Chat')
    return ['text-[#4b9e5f]', 'dark:text-[#86dfba]']
  else
    return ['text-black', 'dark:text-white']
})
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <NLayout class="h-full flex-1" content-style="display: flex; flex-flow: row nowrap; width: 100%;" :has-sider="false">
      <NLayoutSider v-if="!isMobile" :width="72" position="static">
        <div class="flex h-full select-none flex-col items-center justify-between px-2 py-4 bg-[#e8eaf1] dark:bg-[#25272d]">
          <div class="flex flex-col space-y-4">
            <a class="h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]">
              <div class="flex h-full">
                <div class="m-auto text-center" @click="gotoRoute('Chat')">
                  <SvgIcon icon="ri:message-3-line" class="inline-block text-2xl" :class="chatColor" />
                </div>
              </div>
            </a>
          </div>
          <div class="flex flex-col items-center space-y-4">
            <SimpleUserAvatar @click="gotoRoute('User')" />
            <SettingButton @click="gotoRoute('Settings')" />
          </div>
        </div>
      </NLayoutSider>
      <NLayoutContent class="h-full" position="static">
        <RouterView />
      </NLayoutContent>
    </NLayout>
  </div>
</template>

<style scoped>
</style>
