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

const chatColor = function (module: string) {
  if (router.currentRoute.value.name === module)
    return ['text-[#4b9e5f]', 'dark:text-[#86dfba]']
  else
    return ['text-black', 'dark:text-white']
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <NLayout class="h-full flex-1" content-style="display: flex; flex-flow: row nowrap; width: 100%;"
             :has-sider="false">
      <NLayoutSider v-if="!isMobile" :width="72" position="static">
        <div
          class="flex h-full select-none flex-col items-center justify-between px-2 py-4 bg-[#e8eaf1] dark:bg-[#25272d]">
          <div class="flex flex-col space-y-4">
            <div class="flex h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]">
              <div class="m-auto text-center" @click="gotoRoute('Chat')">
                <SvgIcon icon="ri:message-3-line" class="inline-block text-2xl" :class="chatColor('Chat')" />
              </div>
            </div>
<!--            <div class="flex h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]">-->
<!--              <div class="m-auto text-center" @click="gotoRoute('BotSettings')">-->
<!--                <SvgIcon icon="ri:image-2-line" class="inline-block text-2xl" :class="chatColor('BotSettings')" />-->
<!--              </div>-->
<!--            </div>-->
            <div class="flex h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]">
              <div class="m-auto text-center" @click="gotoRoute('BotSettings')">
                <SvgIcon icon="charm:robot" class="inline-block text-2xl" :class="chatColor('BotSettings')" />
              </div>
            </div>
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
    <footer v-if="isMobile" class="bg-white dark:bg-[#25272c]">
      <NGrid x-gap="12" :cols="3" class="justify-between items-center border-t dark:border-t-neutral-800">
        <NGi>
          <div class="m-auto text-center text-slate-500 leading-4" @click="gotoRoute('Chat')">
            <n-space vertical>
              <SvgIcon icon="ri:message-3-line" class="inline-block text-2xl" :class="chatColor('Chat')" />
              聊天
            </n-space>
          </div>
        </NGi>
        <NGi>
          <div class="m-auto text-center text-slate-500 leading-4" @click="gotoRoute('User')">
            <n-space vertical>
              <SvgIcon icon="ri:account-pin-box-line" class="inline-block text-2xl" :class="chatColor('User')" />
              个人设置
            </n-space>
          </div>
        </NGi>
        <NGi>
          <div class="m-auto text-center text-slate-500 leading-4" @click="gotoRoute('Settings')">
            <n-space vertical>
              <SvgIcon icon="ri:settings-4-line" class="inline-block text-2xl" :class="chatColor('Settings')" />
              设置
            </n-space>
          </div>
        </NGi>
      </NGrid>
    </footer>
  </div>
</template>

<style scoped>
</style>
