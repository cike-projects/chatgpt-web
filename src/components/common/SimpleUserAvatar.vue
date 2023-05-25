<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'

const userStore = useUserStore()
userStore.getUserInfo()
const userInfo = computed(() => userStore.userInfo)
</script>

<template>
  <div class="flex items-center justify-center overflow-hidden">
    <div class="w-9 h-9 overflow-hidden rounded-full shrink-0 cursor-pointer">
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar
          :size="36"
          round
          :src="userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
  </div>
</template>
