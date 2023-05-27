<script setup lang='ts'>
import { h, onMounted, reactive, ref } from 'vue'
import { NSpin, NTag } from 'naive-ui'
import { fetchMemberWallet, fetchMemberWalletRecord } from '@/api'

interface WalletRecordInfo {
  token?: number
}

interface PageRecord {
  currentPage: number
  totalPage: number
  dataList: WalletRecordInfo[]
}

const loading = ref(false)

const walletInfo = ref<Settings.WalletInfo>({
  totalValue: 0,
  availableValue: 0,
})
const walletRecords = ref<WalletRecordInfo[]>([])
const page = ref(1)
const totalPage = ref(1)

const columns = reactive([
  {
    title: '编号',
    key: 'sid',
  },
  {
    title: 'Token',
    key: 'token',
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: row.token > 0 ? 'info' : 'error',
          bordered: false,
        },
        {
          default: () => row.token,
        },
      )
    },
  },
  {
    title: '时间',
    key: 'createTime',
  },
  {
    title: '备注',
    key: 'remark',
  },
])

async function fetchWalletInfo() {
  try {
    loading.value = true
    const { data } = await fetchMemberWallet<Settings.WalletInfo>()
    walletInfo.value = data
  }
  finally {
    loading.value = false
  }
}

async function fetchWalletRecord() {
  try {
    loading.value = true
    const { data } = await fetchMemberWalletRecord<PageRecord>(page.value, 10)
    page.value = data.currentPage
    totalPage.value = data.totalPage
    walletRecords.value = data.dataList
  } finally {
    loading.value = false
  }
}

function pageChange(pageIndex: number) {
  page.value = pageIndex
  fetchWalletRecord()
}

onMounted(() => {
  fetchWalletInfo()
  fetchWalletRecord()
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
                  正常
                </n-tag>
              </n-gi>
              <n-gi>
                总 Token：
                <n-tag type="info">
                  {{ walletInfo.totalValue }}
                </n-tag>
              </n-gi>
              <n-gi>
                剩余 Token：
                <n-tag type="info">
                  {{ walletInfo.availableValue }}
                </n-tag>
              </n-gi>
            </n-grid>
          </n-card>
          <n-card title="记录" size="small">
            <n-space vertical>
              <n-data-table :columns="columns" :data="walletRecords" />
              <n-pagination v-model:page="page" v-model:page-count="totalPage" :on-update:page="pageChange" />
            </n-space>
          </n-card>
        </div>
      </div>
    </div>
  </NSpin>
</template>
