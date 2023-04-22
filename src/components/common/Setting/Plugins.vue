<script setup lang='ts'>
import {ref} from 'vue'
import {NSpin} from 'naive-ui'

interface PluginInfo {
  image?: string
  title?: string
  description?: string
  switcher?: boolean
}

const pluginInfosRef = ref<PluginInfo[]>()

pluginInfosRef.value = [
  {
    image: 'https://picsum.photos/id/8/100/100',
    title: 'Chat',
    description: '随便聊聊.',
    switcher: true,
  },
  {
    image: 'https://picsum.photos/id/8/100/100',
    title: 'Explain code',
    description: 'Explain a complicated piece of code.',
    switcher: false,
  },
  {
    image: 'https://picsum.photos/id/8/100/100',
    title: 'SQL translate',
    description: 'Translate natural language to SQL queries.',
    switcher: false,
  },
  {
    image: 'https://picsum.photos/id/8/100/100',
    title: 'Keywords',
    description: 'Extract keywords from a block of text. At a lower temperature it picks keywords from the text. At a higher temperature it will generate related keywords which can be helpful for creating search indexes.',
    switcher: false,
  },
  {
    image: 'https://picsum.photos/id/8/100/100',
    title: 'Create study notes',
    description: 'Provide a topic and get study notes.',
    switcher: false,
  },
]

const loading = ref(false)
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4 outbox">
      <n-card v-for="p in pluginInfosRef">
        <n-thing>
          <template #avatar>
            <n-image
              width="54"
              :src="p.image"
            />
          </template>
          <template #header>
            {{ p.title }}
          </template>
          <template #description>
            {{ p.description }}
          </template>
          <template #footer>
            <n-switch v-model:value="p.switcher" :round="false">
              <template #checked>
                自然赠予你，树冠 微风 肩头的暴雨
              </template>
              <template #unchecked>
                片刻后生成，平衡 忠诚 不息的身体
              </template>
            </n-switch>
          </template>
        </n-thing>
      </n-card>
    </div>
  </NSpin>
</template>

<style scoped>
.outbox {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>
