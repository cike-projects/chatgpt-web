<script setup lang='ts'>
import { NModal } from 'naive-ui'
import { computed } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible),
})

// 移动端自适应相关
const { isMobile } = useBasicLayout()
</script>

<template>
  <NModal v-model:show="show" title="公告栏" style="width: 90%; max-width: 900px;" preset="card">
    <b>请认真阅读，继续使用则代表您认同并遵守，否则请离开。</b><br>
    1、ChattyAI 属于公益项目，使用 ChattyAI 进行知识获取，需要消耗Token。<br>
    2、Token使用。<br>
    3、所有聊天记录均实名记录在案，任何非法使用或非法引导Ai回答的违规内容，均可能带来严重后果，请知悉。<br>
  </NModal>
</template>
