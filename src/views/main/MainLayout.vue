<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { HoverButton, Setting, SimpleUserAvatar, SvgIcon } from '@/components/common'
import {useRouter} from "vue-router";
import {useMessage} from "naive-ui";
const message = useMessage()
const { isMobile } = useBasicLayout()

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

const show = ref(false)
const router = useRouter()
const gotoRoute = function (route_name: string) {
  router.push({ name: route_name })
}
</script>

<template>
  <div class="h-full p-2" style="display: inline-block; float: left; width: 64px; background-color: #eaeaf3; text-align: center">
    <div>
      <div class="sidebar-x">
        <SvgIcon style="font-size: 30px; cursor: pointer;" icon="solar:chat-dots-outline" @click="gotoRoute('Chat')" />
      </div>
      <div class="sidebar-x">
        <SvgIcon style="font-size: 40px; cursor: pointer;" icon="skill-icons:mysql-dark" @click="message.error('暂未实现')" />
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
      <RouterView />
    </div>
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
