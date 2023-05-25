<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NLayout, useMessage, useNotification } from "naive-ui";
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useRouter } from "vue-router";
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from "@/store";
import SimpleUserAvatar from "@/components/common/SimpleUserAvatar.vue";
import SettingButton from "@/components/common/SettingButton.vue";

const message = useMessage()
const notification = useNotification()

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const collapsed = computed(() => appStore.siderCollapsed)

const show = ref(false)
const router = useRouter()
const gotoRoute = function (route_name: string) {
  if (router.currentRoute.value.name === route_name)
    return
  router.push({ name: route_name })
}

const chatColor = computed(() => router.currentRoute.value.name === 'Chat' ? '#99dcbd' : '#ffffff')
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <NLayout class="h-full flex-1" content-style="display: flex; flex-flow: row nowrap; width: 100%;" :has-sider="false">
      <NLayoutSider :width="72" position="static">
        <div class="flex h-full select-none flex-col items-center justify-between px-2 py-4 bg-[#e8eaf1] dark:bg-[#25272d]">
          <div class="flex flex-col space-y-4">
            <a class="h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]">
              <div class="flex h-full">
                <div class="m-auto text-center" @click="gotoRoute('Chat')">
                  <SvgIcon icon="ri:message-3-line" class="inline-block text-2xl text-black dark:text-white" :color="chatColor" />
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
.sidebar-x {
  padding: 2px;
  background-color: #ffffff;
  border-radius: 15px;
  margin-top: 10px;
  text-align: center;
}

.sidebar-active {
  border: 1px solid #fecf57;
}
</style>
