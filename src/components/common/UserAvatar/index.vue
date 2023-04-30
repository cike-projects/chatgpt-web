<script setup lang='ts'>
import { computed } from 'vue'
import { useUserStore } from '@/store'
import { isString } from '@/utils/is'

const userStore = useUserStore()
userStore.getUserInfo()
const userInfo = computed(() => userStore.userInfo)
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.nickname ?? '未知' }}
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userInfo.description) && userInfo.description !== ''"
          v-html="userInfo.description"
        />
      </p>
    </div>
  </div>
</template>
