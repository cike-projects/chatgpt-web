<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NInput, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStoreWithout, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { fetchMemberInfo, modifyMemberInfo } from '@/api'

const userStore = useUserStore()
const message = useMessage()
const authStore = useAuthStoreWithout()
const router = useRouter()

const memberInfo = ref<Settings.MemberInfo>({})

const { isMobile } = useBasicLayout()

const logout = function () {
  authStore.logout()
  router.push({ name: 'Login' })
}

const modifyAvatarAndNickname = function () {
  if (!memberInfo.value.avatar || !memberInfo.value.nickname) {
    message.error('头像或者昵称不能为空')
  } else {
    modifyMemberInfo(memberInfo.value.avatar, memberInfo.value.nickname).then(() => {
      // 登录成功
      message.success('修改成功')
      userStore.updateUserInfo({
        avatar: memberInfo.value.avatar,
        nickname: memberInfo.value.nickname,
      })
    }).catch((error) => {
      message.error(error.message)
    })
  }
}

async function getMemberInfo() {
  const { data } = await fetchMemberInfo<Settings.MemberInfo>()
  memberInfo.value = data
}

onMounted(() => {
  getMemberInfo()
})
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :style="{ maxWidth: '640px' }"
      >
        <NFormItem label=" ">
          <n-avatar
            round
            :size="64"
            :src="memberInfo.avatar"
          />
        </NFormItem>
        <n-form-item label="头像" path="inputValue">
          <NInput v-model:value="memberInfo.avatar" placeholder="" />
        </n-form-item>
        <n-form-item label="昵称" path="inputValue" required>
          <NInput v-model:value="memberInfo.nickname" placeholder="" />
        </n-form-item>
        <n-form-item label="账号" path="inputValue" required>
          <NInput :value="memberInfo.username" placeholder="" disabled />
        </n-form-item>
        <n-form-item label=" ">
          <n-space>
            <n-button type="primary" @click="modifyAvatarAndNickname">
              更新信息
            </n-button>
            <n-button type="warning" @click="logout">
              退出登录
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>
