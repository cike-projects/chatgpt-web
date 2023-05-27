<script setup lang='ts'>
import { ref } from 'vue'
import { NTabPane, NTabs } from 'naive-ui'
import General from './General.vue'
import ModifyPassword from './ModifyPassword.vue'
import Billing from './Billing.vue'
import Meal from './Meal.vue'
import InvitationCode from './InvitationCode.vue'
import { SvgIcon } from '@/components/common'
import { useRouter } from 'vue-router'

const router = useRouter()
const active = ref(router.currentRoute.value.query.id ?? 'General')
</script>

<template>
  <div>
    <NTabs v-model:value="active" type="line" animated>
      <NTabPane name="General" tab="General">
        <template #tab>
          <SvgIcon class="text-lg" icon="ri:file-user-line" />
          <span class="ml-2">{{ $t('setting.general') }}</span>
        </template>
        <div class="min-h-[100px]">
          <General />
        </div>
      </NTabPane>
      <NTabPane name="Billing" tab="Billing">
        <template #tab>
          <SvgIcon class="text-lg" icon="material-symbols:money-outline" />
          <span class="ml-2">{{ $t('setting.billing') }}</span>
        </template>
        <div class="min-h-[100px]">
          <Billing />
        </div>
      </NTabPane>
      <NTabPane name="Meal" tab="Meal">
        <template #tab>
          <SvgIcon class="text-lg" icon="material-symbols:money-outline" />
          <span class="ml-2">套餐</span>
        </template>
        <div class="min-h-[100px]">
          <Meal />
        </div>
      </NTabPane>
      <NTabPane name="InvitationCode" tab="InvitationCode">
        <template #tab>
          <SvgIcon class="text-lg" icon="material-symbols:money-outline" />
          <span class="ml-2">邀请码</span>
        </template>
        <div class="min-h-[100px]">
          <InvitationCode />
        </div>
      </NTabPane>
      <NTabPane name="修改密码" tab="修改密码">
        <template #tab>
          <SvgIcon class="text-lg" icon="ri:equalizer-line" />
          <span class="ml-2">修改密码</span>
        </template>
        <div class="min-h-[100px]">
          <ModifyPassword />
        </div>
      </NTabPane>
    </NTabs>
  </div>
</template>
