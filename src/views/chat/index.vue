<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, h, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NAutoComplete, NButton, NInput, NTag, useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { useUsingContext } from './hooks/useUsingContext'
import HeaderComponent from './components/Header/index.vue'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore, usePromptStore } from '@/store'
import { fetchChatAPIProcess } from '@/api'
import { t } from '@/locales'
import SimpleUserAvatar from '@/components/common/SimpleUserAvatar.vue'

let controller = new AbortController()

const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { usingContext, toggleUsingContext } = useUsingContext()

let { uuid } = route.params as { uuid: string }
const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

const prompt = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)

// 添加PromptStore
const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading)
    updateChatSome(+uuid, index, { loading: false })
})

function handleSubmit() {
  onConversation()
}

async function onConversation() {
  let message = prompt.value

  if (loading.value)
    return

  if (!message || message.trim() === '')
    return

  controller = new AbortController()

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: null },
    },
  )

  uuid = `${chatStore.active}`
  scrollToBottom()

  loading.value = true
  prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext && usingContext.value)
    options = { ...lastContext }

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: '思考中, 请稍等...',
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )
  scrollToBottom()

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        conversationId: chatStore.active,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            updateChat(
              +uuid,
              dataSources.value.length - 1,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            if (openLongReply && data.finishReason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }

            scrollToBottomIfAtBottom()
          } catch (error) {
            //
          }
        },
      })
      updateChatSome(+uuid, dataSources.value.length - 1, { loading: false })
    }

    await fetchChatAPIOnce()
  } catch (error: any) {
    const errorMessage = error?.message ?? t('common.wrong')

    if (error.message === 'canceled') {
      updateChatSome(
        +uuid,
        dataSources.value.length - 1,
        {
          loading: false,
        },
      )
      scrollToBottomIfAtBottom()
      return
    }

    const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1)

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(
        +uuid,
        dataSources.value.length - 1,
        {
          text: `${currentChat.text}\n[${errorMessage}]`,
          error: false,
          loading: false,
        },
      )
      return
    }

    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
    scrollToBottomIfAtBottom()
  } finally {
    loading.value = false
  }
}

async function onRegenerate(index: number) {
  if (loading.value)
    return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  loading.value = true

  updateChat(
    +uuid,
    index,
    {
      dateTime: new Date().toLocaleString(),
      text: '思考中, 请稍等...',
      inversion: false,
      error: false,
      loading: true,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        conversationId: chatStore.active,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            updateChat(
              +uuid,
              index,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            if (openLongReply && data.finishReason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }
          } catch (error) {
            //
          }
        },
      })
      updateChatSome(+uuid, index, { loading: false })
    }
    await fetchChatAPIOnce()
  } catch (error: any) {
    if (error.message === 'canceled') {
      updateChatSome(
        +uuid,
        index,
        {
          loading: false,
        },
      )
      return
    }

    const errorMessage = error?.message ?? t('common.wrong')

    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
  } finally {
    loading.value = false
  }
}

function handleExport() {
  if (loading.value)
    return

  const d = dialog.warning({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL('image/png')
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      } catch (error: any) {
        ms.error(t('chat.exportFailed'))
      } finally {
        d.loading = false
      }
    },
  })
}

function handleDelete(index: number) {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(+uuid, index)
    },
  })
}

function handleClear() {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(+uuid)
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  } else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort()
    loading.value = false
  }
}

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: {
      key: string
    }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  } else if (prompt.value.startsWith('@')) {
    return ['@image256x256 ', '@image512x512 ', '@image1024x1024 '].filter(it => it.startsWith(prompt.value)).map((suffix) => {
      return {
        label: suffix,
        value: suffix,
      }
    })
  } else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  if (option.label.startsWith('@'))
    return [option.label, ' ', h(NTag, { size: 'small', type: 'info' }, { default: () => 'Image' })]

  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

const fillInput = function (suggest: string) {
  prompt.value = suggest
}

onMounted(() => {
  scrollToBottom()
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})

const promptSuggests = reactive([
  {
    title: '妙用（示例）',
    icon: 'ri:lightbulb-flash-line',
    data: [
      {
        name: '搜索神器',
        prompt: '我几个有一本书讲述一个二维空间的世界，好像居民都是几个图形。主人公是个正方形。有一天，一个来自名叫空间的三维球体跑来拜访这个正方形。平面国的居民眼看这个球体可以随意变化大小（进出平面），吓得目瞪口呆。这是哪本书？给我具体的介绍，并推荐几本类似的。',
      },
      {
        name: '自学神器',
        prompt: '作为一个纯小白，我想自学python，但是我完全不知道从哪学起，请告诉我第一步应该怎么做，比如怎么安装环境，要注意什么，然后给我写一个最简单的python程序，备注出每一句的意思，让我明白。',
      },
      {
        name: '以文生文',
        prompt: '曲曲折折的荷塘上面，弥望的是田田的叶子。 叶子出水很高，像亭亭的舞女的裙。 层层的叶子中间，零星地点缀着些白花，有袅娜地开着的，有羞涩地打着朵儿的；正如一粒粒的明珠，又如碧天里的星星，又如刚出浴的美人。 微风过处，送来缕缕清香，仿佛远处高楼上渺茫的歌声似的。 这时候叶子与花也有一丝的颤动，像闪电般，霎时传过荷塘的那边去了。 叶子本是肩并肩密密地挨着，这便宛然有了一道凝碧的波痕。 叶子底下是脉脉的流水，遮住了，不能见一些颜色；而叶子却更见风致了。 以上来自朱自清的散文《荷塘月色》，仿照文章的感觉，再写一篇，关于竹子的',
      },
      {
        name: '超级导购',
        prompt: '我想买一款相机，平时旅游用，价格在8000-12000左右，有什么推荐的吗',
      },
    ],
  },
  {
    title: '职场（示例）',
    icon: 'ri:ai-generate',
    data: [
      {
        name: '万能助理',
        prompt: '我想去澳大利亚旅游，时间是下个月底，大概晚一星期，先去凯恩斯呆三天，再去悉尼呆四天。但是我是第一次出国，流程完全不清楚，请给我详细的步骤说明和建议，包括签证，机票，酒店，申请资料和必要的建议。',
      },
      {

        name: '职场写作',
        prompt: '写一个会议通知，内容是关于AIGC的，邀请了行业专家周鹏教授，讲解AI时代的内容创作，时间6月25号，地点会议中心301，强调会议的重要性。尤其突出周鹏教授的经历，比如具体的专家或者取得的成就，凸显会议的价值。',
      },
      {
        name: '超级程序员',
        prompt: '用python写一个石头剪刀布的小游戏，代码要尽量高效，节省资源，另外测试好bug，让我直接可以用。',
      },
      {
        name: '闪电大纲',
        prompt: '我要写一个PPT大纲，标题是：新生儿的产后护理 请把大纲提供给我，以markdown格式输出',
      },
    ],
  },
  {
    title: '学习（示例）',
    icon: 'ri:book-mark-line',
    data: [
      {
        name: '作文辅导',
        prompt: '你现在是一个优秀的语文老师，尤其擅长小学生作文，这是我孩子写的作文，有哪些可以提升的点，让作文更精彩，多给我几个方案和思路，说清楚修改的理由及好处，并改好给我： 初冬的一个中午，小红的爷爷坐在院子里一棵大树古旁边编箩筐，旁边一只母鸡带着一群小鸡在寻找食物。这时，小红蹦蹦跳跳的放学回来了，手里拿着一张成绩通知书。爷爷问他为什么这么高兴，他走到爷爷跟前说了句悄悄话：“爷爷，成绩通知书下来了，我得了满分。”爷爷听了高兴地笑了。',
      },
      {
        name: '数学家教',
        prompt: '你现在是一个优秀的数理化老师，我孩子上小学，这道题做错了。原题是：8和10的最大公因数和最小公倍数分别是多少，我孩子回答的是1和80，正确的答案是2和40。请先分析出他为什么答错，再给出正确的解题思路，越简单越好',
      },
      {
        name: '单词神器',
        prompt: '以下几组单词我特别容易混淆，请按照音标、中文翻译、英文释义、词根词源、助记和例句的形式，做到一个表格给我。 quite quiet affect effect adapt adopt adept',
      },
      {
        name: '超级公式',
        prompt: '打印相对论公式',
      },
    ],
  },
])
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="usingContext"
      @export="handleExport"
      @toggle-using-context="toggleUsingContext"
    />
    <div class="h-[60px] p-[12px] align-center border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20" v-if="+uuid !== 0">
      <NSpace style="align-items: center; max-width: 400px">
        <SimpleUserAvatar />
        <span>{{ currentChatHistory.botName }}</span>
      </NSpace>
    </div>
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          id="image-wrapper"
          class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <template v-if="!dataSources.length">
            <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
              <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
              <span>ChattyAI~</span>
            </div>
            <div style="margin-top: 20px">
              <NGrid x-gap="12" :cols="3">
                <NGi v-for="promptSuggest in promptSuggests">
                  <NSpace vertical>
                    <h2 class="text-md text-center">
                      <SvgIcon :icon="promptSuggest.icon"
                               class="mb-2 inline-block text-lg text-black dark:text-white" />
                      <p>
                        {{ promptSuggest.title }}
                      </p>
                    </h2>
                    <div v-for="suggest in promptSuggest.data" :title="suggest.name"
                         class="text-ellipsis-1 cursor-pointer rounded bg-neutral-100 p-4 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                         @click="fillInput(suggest.prompt)">
                      {{ suggest.name }}
                    </div>
                  </NSpace>
                </NGi>
              </NGrid>
            </div>
          </template>
          <template v-else>
            <div>
              <Message
                v-for="(item, index) of dataSources"
                :key="index"
                :date-time="item.dateTime"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              />
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  Stop Responding
                </NButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <HoverButton @click="handleClear">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
          <HoverButton v-if="!isMobile" @click="handleExport">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:download-2-line" />
            </span>
          </HoverButton>
          <HoverButton v-if="!isMobile" @click="toggleUsingContext">
            <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
              <SvgIcon icon="ri:chat-history-line" />
            </span>
          </HoverButton>
          <NAutoComplete v-model:value="prompt" :options="searchOptions" :render-label="renderOption">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                ref="inputRef"
                v-model:value="prompt"
                type="textarea"
                :placeholder="placeholder"
                :autosize="{ minRows: isMobile ? 1 : 2, maxRows: isMobile ? 4 : 8 }"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keypress="handleEnter"
              >
                <template #suffix>
                  <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
                    <template #icon>
                      <span class="dark:text-black">
                        <SvgIcon icon="ri:send-plane-fill" />
                      </span>
                    </template>
                  </NButton>
                </template>
              </NInput>
            </template>
          </NAutoComplete>
        </div>
      </div>
    </footer>
  </div>
</template>
