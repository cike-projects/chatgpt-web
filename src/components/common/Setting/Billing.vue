<script setup lang='ts'>
import {onMounted, ref} from 'vue'
import {NSpin} from 'naive-ui'
import {fetchBillingUsage} from '@/api'

interface BillingUsage {
  totalUsage?: number
}

const loading = ref(false)

const config = ref<BillingUsage>()

async function fetchConfig() {
  try {
    loading.value = true
    const {data} = await fetchBillingUsage<BillingUsage>()
    config.value = data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <div class="max-w-screen-lg space-y-4">
          <n-card title="余额" size="small">
            <n-grid x-gap="12" :cols="3">
              <n-gi>
                会员状态：
                <n-tag type="info">
                  哪里都是你
                </n-tag>
                <div class="light-green"/>
              </n-gi>
              <n-gi>
                总 Token：
                <n-tag type="info">
                  哪里都是你
                </n-tag>
                <div class="green"/>
              </n-gi>
              <n-gi>
                剩余 Token：
                <n-tag type="info">
                  哪里都是你
                </n-tag>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card title="记录" size="small">
            <n-table :single-line="false" size="small">
              <thead>
              <tr>
                <th>编号</th>
                <th>Token</th>
                <th>时间</th>
                <th>备注</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>放弃</td>
                <td>反常的</td>
                <td>彻底废除</td>
                <td>...</td>
              </tr>
              <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
              </tbody>
            </n-table>
          </n-card>
        </div>
      </div>
    </div>
  </NSpin>
</template>
