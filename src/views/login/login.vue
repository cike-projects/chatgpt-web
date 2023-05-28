<script lang="ts" setup>
import { ref } from 'vue'

import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

import { authLogin, authSignup } from '@/api'

interface ModelType {
  username: string | null
  password: string | null
  email: string | null
  invitationCode?: string | null
}

const authStore = useAuthStoreWithout()
const router = useRouter()
const message = useMessage()
window.$message = message
const modelRef = ref<ModelType>({
  username: null,
  password: null,
  email: null,
})

const isLogin = ref(true)
const emailFormat = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
function handleValidateSignup() {
  if (!modelRef.value.username) {
    message.error('请输入用户名')
    return
  }
  if (!modelRef.value.password) {
    message.error('请输入密码')
    return
  }

  if (!modelRef.value.email || !emailFormat.test(modelRef.value.email)) {
    message.error('请输入正确的邮箱，邮箱将用来做账号激活操作')
    return
  }
  authSignup(modelRef.value.username, modelRef.value.password, modelRef.value.email, modelRef.value.invitationCode).then((response) => {
    // 登录成功
    authStore.loginSuccess(response.data)
    message.success('注册成功，欢迎使用👏')
    router.push({ name: 'Chat' })
  }).catch((error) => {
    message.error(error.message)
  })
}

function handleValidateButtonClick() {
  if (!modelRef.value.username) {
    message.error('请输入用户名')
    return
  }
  if (!modelRef.value.password) {
    message.error('请输入密码')
    return
  }
  authLogin(modelRef.value.username, modelRef.value.password).then((response) => {
    // 登录成功
    authStore.loginSuccess(response.data)
    message.success('登录成功，正在跳转')
    router.push({ name: 'Chat' })
  }).catch((error) => {
    message.error(error.message)
  })
}
</script>

<template>
  <div class="body">
    <!-- login/register container -->
    <div class="container">
      <!-- register -->
      <div v-show="!isLogin" class="form-container sign-up-container">
        <div class="form">
          <h2>sign up</h2>
          <input v-model="modelRef.username" type="text" placeholder="用户名...">
          <input v-model="modelRef.email" type="email" placeholder="邮箱...">
          <input v-model="modelRef.password" type="password" placeholder="密码...">
          <input v-model="modelRef.invitationCode" type="text" placeholder="邀请码...">
          <span class="forget-password">当前项目处于内测阶段，测试结束后会根据具体的情况处理数据</span>
          <button class="signUp" @click="handleValidateSignup"> 注 册 </button>
        </div>
      </div>
      <!-- login -->
      <div v-show="isLogin" class="form-container sign-in-container">
        <div class="form">
          <h2>sign in</h2>
          <input v-model="modelRef.username" type="text" placeholder="用户名...">
          <input v-model="modelRef.password" type="password" placeholder="密码...">
          <button class="signIn" @click="handleValidateButtonClick"> 登 录 </button>
        </div>
      </div>
      <!-- overlay container -->
      <div class="overlay_container">
        <div class="overlay">
          <!-- overlay left -->
          <div v-show="!isLogin" class="overlay_panel overlay_right_container">
            <h2>welcome back!</h2>
            <p>To keep connected with us please login with your personal info</p>
            <button id="sign-in" @click="isLogin = true">sign in</button>
          </div>
          <!-- overlay right -->
          <div v-show="isLogin" class="overlay_panel overlay_right_container">
            <h2>hello friend!</h2>
            <p>Enter your personal details and start journey with us</p>
            <button id="sign-up" @click="isLogin = false">sign up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  background: #f6f5f7 url(@/assets/bg_0.png) repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h2 {
  margin-bottom: 10px;
  font-size: 32px;
  text-transform: capitalize;
}

.container {
  position: relative;
  width: 768px;
  height: 480px;
  background-color: white;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: white;
  transition: all 0.6s ease-in-out;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 50px;
}

input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  background-color: #eee;
  border: none;
}

.forget-password {
  display: inline-block;
  height: 20px;
  text-decoration: none;
  color: #bbb;
  text-transform: capitalize;
  font-size: 12px;
}

.forget-password:hover {
  color: lightslategray;
  border-bottom: 2px solid #ff4b2b;
}

button {
  background: #ff4b2b;
  padding: 10px 50px;
  border: 1px solid transparent;
  border-radius: 20px;
  text-transform: uppercase;
  color: white;
  margin-top: 10px;
  outline: none;
  transition: transform 80;
}

button:active {
  transform: scale(0.95);
}

.overlay_container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 100;
  right: 0;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
}

.overlay {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -100%;
  background-color: #ff4b2b;
}

.overlay_panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  color: white;
  padding: 0 40px;
  text-align: center;
}

.overlay_panel button {
  background-color: transparent;
  border: 1px solid white;
}

.overlay_panel p {
  font-size: 12px;
  margin: 10px 0 15px 0;
}

.overlay_right_container {
  right: 0;
}


.container.active .overlay_container {
  transform: translateX(-100%);
}

.container.active .overlay {
  transform: translateX(50%);
}
</style>
