<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import { fetchBillingUsage } from '@/api'

interface BillingUsage {
  totalUsage?: number
}

const loading = ref(false)

const config = ref<BillingUsage>()

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchBillingUsage<BillingUsage>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <p>最近 100 天费用：{{ config?.totalUsage ?? '-' }} $</p>
    </div>
  </NSpin>
</template>
