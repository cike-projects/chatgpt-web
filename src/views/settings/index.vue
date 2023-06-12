<script lang="ts" setup>
import { computed } from 'vue'
import { NButton, NPopconfirm, NSelect } from 'naive-ui'
import type { Language, SidePattern, Theme } from '@/store/modules/app/helper'
import { useAppStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const appStore = useAppStore()

const { isMobile } = useBasicLayout()

const theme = computed(() => appStore.theme)
const sidePattern = computed(() => appStore.sidePattern)

const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})

const themeOptions: { label: string; key: Theme; icon: string; value: Theme }[] = [
  {
    label: '系统',
    key: 'auto',
    value: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: '亮色',
    key: 'light',
    value: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: '暗色',
    key: 'dark',
    value: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
]

const sideOptions: { label: string; key: SidePattern; value: SidePattern }[] = [
  { label: '同一侧', key: 'SAME', value: 'SAME' },
  { label: '两侧', key: 'DIFF', value: 'DIFF' },
]

function clearData(): void {
  localStorage.removeItem('chatStorage')
  location.reload()
}
</script>

<template>
  <div class="p-8 space-y-5 min-h-[200px]">
    <div class="space-y-6 max-w-[460px]">
      <NH1>设置</NH1>
      <n-form>
        <n-form-item label="主题">
          <NSelect
            :value="theme"
            :options="themeOptions"
            @update-value="value => appStore.setTheme(value)"
          />
        </n-form-item>
        <n-form-item label="显示语言">
          <NSelect
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          />
        </n-form-item>
        <n-form-item label="头像对齐方式">
          <NSelect
            :value="sidePattern"
            :options="sideOptions"
            @update-value="value => appStore.setSide(value)"
          />
        </n-form-item>
        <n-form-item label="清理缓存">
          <p class="text-sm text-slate-400">
            清理浏览器缓存，能修复部份异常问题
            <NPopconfirm placement="bottom" @positive-click="clearData">
              <template #trigger>
                <NButton size="small" quaternary type="primary">
                  {{ $t('common.clear') }}
                </NButton>
              </template>
              {{ $t('chat.clearHistoryConfirm') }}
            </NPopconfirm>
          </p>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>
