<script lang="ts" setup>
import { computed } from 'vue'
import { NButton, NPopconfirm, NSelect } from 'naive-ui'

import { Setting } from '@/components/common'

</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <NH1>个人中心</NH1>
      <Setting />
    </div>
  </div>
</template>
