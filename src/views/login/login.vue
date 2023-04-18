<script lang="ts" setup>
import {ref} from 'vue'

import type {
  FormInst,
  FormRules,
} from 'naive-ui'

import {useMessage} from 'naive-ui'
import {useRouter} from 'vue-router'
import {useAuthStoreWithout} from '@/store/modules/auth'

import {authLogin} from '@/api'

interface ModelType {
  username: string | null
  password: string | null
}

const authStore = useAuthStoreWithout()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
window.$message = message
const modelRef = ref<ModelType>({
  username: null,
  password: null,
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
  ],
}

function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      authLogin(modelRef.value.username, modelRef.value.password).then((response) => {
        // 登录成功
        authStore.loginSuccess(response.data)
        router.push({name: 'Chat'})
      }).catch((error) => {
        message.error(error.message)
      })
    } else {
      message.error('验证失败')
    }
  })
}
</script>

<template>
  <div class="login_bg">
    <div class="login-container">
      <NCard embedded class="login-card" title="欢迎回来">
        <n-form ref="formRef" :model="modelRef" :rules="rules">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="modelRef.username"/>
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="modelRef.password"
              type="password"
            />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button
                  :disabled="modelRef.username === null || modelRef.password === null"
                  round
                  type="primary"
                  @click="handleValidateButtonClick"
                >
                  登录
                </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.login_bg {
  height: 100%;
  background: #ffffff url(@/assets/bg_0.png) repeat
}

.login-container {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
  margin-right: 250px;
}

.login-card {
  width: 400px;
  background-color: #ffffff;
}
</style>
