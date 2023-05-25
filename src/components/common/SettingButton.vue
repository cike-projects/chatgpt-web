<script setup lang='ts'>
import {computed} from 'vue'
import {useUserStore} from '@/store'
import {SvgIcon} from '@/components/common'

const userStore = useUserStore()
userStore.getUserInfo()
const userInfo = computed(() => userStore.userInfo)
</script>

<template>
  <div class="flex items-center justify-center w-10 h-10 overflow-hidden rounded-md cursor-pointer hover:bg-white dark:hover:bg-[#33373c]">
    <span class="text-xl dark:text-white">
      <SvgIcon icon="ri:settings-4-line" />
    </span>
  </div>
</template>
