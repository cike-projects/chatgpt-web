<script setup lang='ts'>
import {computed, ref} from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
import { HoverButton, Setting, SimpleUserAvatar, SvgIcon } from '@/components/common'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})

const show = ref(false)

</script>

<template>
  <div class="h-full p-2" style="display: inline-block; float: left; width: 64px; background-color: #eaeaf3; text-align: center">
    <div>
      <div class="sidebar-x">
        <SvgIcon style="font-size: 30px" icon="solar:chat-dots-outline" />
      </div>
      <div class="sidebar-x">
        <SvgIcon style="font-size: 40px" icon="skill-icons:mysql-dark" />
      </div>
    </div>
    <div style="position:fixed; bottom: 20px">
      <SimpleUserAvatar />
      <div style="height: 10px" />
      <HoverButton @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
      </HoverButton>
      <Setting v-if="show" v-model:visible="show" />
    </div>
  </div>
  <div class="h-full dark:bg-[#24272e] transition-all">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
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
</style>
