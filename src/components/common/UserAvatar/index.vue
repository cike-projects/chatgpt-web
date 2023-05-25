<script setup lang='ts'>
import { computed } from 'vue'
import { useThemeVars } from 'naive-ui'
import { useUserStore } from '@/store'
import { isString } from '@/utils/is'

const userStore = useUserStore()
userStore.getUserInfo()
const userInfo = computed(() => userStore.userInfo)
const themeVars = useThemeVars()
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        4,504 (90%)
      </h2>
      <n-progress
        type="line"
        :show-indicator="false"
        :percentage="20"
      />
    </div>
  </div>
</template>
