<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { memberModifyPwd } from '@/api'

interface ModelType {
  oldPassword: string | null
  newPassword: string | null
  reenteredPassword: string | null
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const message = useMessage()
    const modelRef = ref<ModelType>({
      oldPassword: '',
      newPassword: '',
      reenteredPassword: '',
    })
    function validatePasswordStartWith(
      rule: FormItemRule,
      value: string,
    ): boolean {
      return (
        !!modelRef.value.newPassword
        && modelRef.value.newPassword.startsWith(value)
        && modelRef.value.newPassword.length >= value.length
      )
    }

    function validatePasswordSame(rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.newPassword
    }

    const rules: FormRules = {
      oldPassword: [
        {
          required: true,
          message: '请输入旧密码',
        },
      ],
      newPassword: [
        {
          required: true,
          message: '请输入新密码',
        },
      ],
      reenteredPassword: [
        {
          required: true,
          message: '请再次输入密码',
          trigger: ['input', 'blur'],
        },
        {
          validator: validatePasswordStartWith,
          message: '两次密码输入不一致',
          trigger: 'input',
        },
        {
          validator: validatePasswordSame,
          message: '两次密码输入不一致',
          trigger: ['blur', 'password-input']
        },
      ]
    }
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        }
      },
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            memberModifyPwd(modelRef.value.oldPassword, modelRef.value.newPassword).then(() => {
              message.success('修改成功')
              modelRef.value.newPassword = ''
              modelRef.value.oldPassword = ''
              modelRef.value.reenteredPassword = ''
            }).catch((error) => {
              message.error(error.message)
            })
          } else {
            console.log(errors)
            message.error('验证失败')
          }
        })
      },
    }
  },
})
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="max-w-[460px]">
        <n-form ref="formRef" :model="model" :rules="rules" label-width="100px" label-placement="left"
                autocomplete="off">
          <n-form-item path="oldPassword" label="旧密码">
            <n-input v-model:value="model.oldPassword" autocomplete="off" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="newPassword" label="新密码">
            <n-input
              v-model:value="model.newPassword"
              autocomplete="off"
              type="password"
              @input="handlePasswordInput"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item
            ref="rPasswordFormItemRef"
            first
            path="reenteredPassword"
            label="确认密码"
          >
            <n-input
              v-model:value="model.reenteredPassword"
              :disabled="!model.newPassword"
              type="password"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item label=" ">
            <n-button
              :disabled="model.oldPassword === null"
              type="primary"
              @click="handleValidateButtonClick"
            >
              更新密码
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>
