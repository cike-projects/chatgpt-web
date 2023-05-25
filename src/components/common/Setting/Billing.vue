<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue'
import {NSpin} from 'naive-ui'
import {fetchBillingUsage} from '@/api'

interface BillingUsage {
  totalUsage?: number
}

const loading = ref(false)

const config = ref<BillingUsage>()
const data = ref([])
const page = ref(1)
const totalPage = ref(1)

const columns = reactive([
  {
    title: '编号',
    key: 'name',
  },
  {
    title: 'Token',
    key: 'age',
  },
  {
    title: '时间',
    key: 'address',
  },
  {
    title: '类型',
    key: 'address',
  },
  {
    title: '备注',
    key: 'address',
  },
])

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
            <n-space vertical>
              <n-data-table :columns="columns" :data="data" />
              <n-pagination v-model:page="page" v-model:page-count="totalPage" />
            </n-space>
          </n-card>
        </div>
      </div>
    </div>
  </NSpin>
</template>
