<script lang="ts" setup>
import {computed, ref} from 'vue'
import {NInput, useMessage} from 'naive-ui'
import {useAppStore, useUserStore} from '@/store'
import type {UserInfo} from '@/store/modules/user/helper'
import {useBasicLayout} from '@/hooks/useBasicLayout'
import {t} from '@/locales'

const appStore = useAppStore()
const userStore = useUserStore()

const {isMobile} = useBasicLayout()

const ms = useMessage()

const userInfo = computed(() => userStore.userInfo)

const avatar = ref(userInfo.value.avatar ?? '')
const nickname = ref(userInfo.value.nickname ?? '')
const username = ref(userInfo.value.username ?? '')

function updateUserInfo(options: Partial<UserInfo>) {
  userStore.updateUserInfo(options)
  ms.success(t('common.success'))
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <n-avatar
        round
        :size="64"
        :src="avatar"
      />
      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :style="{ maxWidth: '640px' }"
      >
        <n-form-item label="头像" path="inputValue">
          <NInput v-model:value="avatar" placeholder=""/>
        </n-form-item>
        <n-form-item label="昵称" path="inputValue" required>
          <NInput v-model:value="nickname" placeholder=""/>
        </n-form-item>
        <n-form-item label="账号" path="inputValue" required>
          <NInput v-model:value="username" placeholder="" disabled/>
        </n-form-item>
        <n-form-item label=" ">
          <n-space>
            <n-button type="primary" size="medium">
              更新信息
            </n-button>
            <n-button type="warning">
              退出登录
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>
