<script setup lang='ts'>
import {computed, ref} from 'vue'
import {useBasicLayout} from '@/hooks/useBasicLayout'
import {HoverButton, Setting, SimpleUserAvatar, SvgIcon} from '@/components/common'
import {useRouter} from "vue-router";
import {NLayout, useMessage, useNotification} from "naive-ui";
import {useAppStore, useChatStore} from "@/store";

const message = useMessage()
const notification = useNotification()

const appStore = useAppStore()
const chatStore = useChatStore()

const {isMobile} = useBasicLayout()
const collapsed = computed(() => appStore.siderCollapsed)

const show = ref(false)
const router = useRouter()
const gotoRoute = function (route_name: string) {
  if (router.currentRoute.value.name === route_name)
    return
  router.push({name: route_name})
}

</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <NLayout class="h-full flex-1" content-style="display: flex; flex-flow: row nowrap; width: 100%;">
      <NLayoutSider
        class="h-full align-center"
        :width="72"
        position="static"
        bordered
      >
        <div>
          <div class="sidebar-x" :class="{ 'sidebar-active': router.currentRoute.value.name === 'Chat' }">
            <SvgIcon style="font-size: 30px; cursor: pointer;" icon="solar:chat-dots-outline"
                     @click="gotoRoute('Chat')"/>
          </div>
        </div>
        <div style="position:fixed; bottom: 20px">
          <SimpleUserAvatar @click="gotoRoute('User')"/>
          <div style="height: 10px"/>
          <HoverButton @click="gotoRoute('Settings')">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:settings-4-line"/>
            </span>
          </HoverButton>
          <Setting v-if="show" v-model:visible="show"/>
        </div>
      </NLayoutSider>
      <NLayoutContent class="h-full" position="static">
        <RouterView/>
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
