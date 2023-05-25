<script setup lang='ts'>
import { ref } from 'vue'
import { NSpin } from 'naive-ui'

const loading = ref(false)
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <div class="max-w-screen-lg space-y-4">
          <n-card size="small">
            <b>什么是Token？</b><br>
            Token是指将文本分解的最小单位，OpenAI的GPT接口使用Token计费，收发都会消耗Token。<br>
            具体消耗多少由 [ 内容长度 ] 和 [ 使用模型 ] 而定。内容越长消耗越多，GPT4 比 GPT3.5 消耗多60倍。<br>
          </n-card>
          <n-card title="使用Token兑换码" size="small">
            <n-space>
              <n-input placeholder="请填写：Token 兑换码..." class="w-[280px]" />
              <NButton type="primary">
                提交兑换
              </NButton>
            </n-space>
          </n-card>
          <n-card title="获取Token兑换码" size="small">
            <n-grid x-gap="12" y-gap="12" :cols="3">
              <n-gi>
                <n-card size="small">
                  <NH2>跟着张老师学 HTML（送300万Token）</NH2>
                  <div>
                    剩余 Token：
                    <n-tag type="info">
                      哪里都是你
                    </n-tag>
                  </div>
                  <div style="margin-top: 10px">
                    【开通GPT4】张老师 HTML 同学专享，含300万Token。限时，限购1次。
                  </div>
                  <div style="margin-top: 10px">
                    <NButton type="primary">
                      立即购买
                    </NButton>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card size="small">
                  <NH2>跟着张老师学 HTML（送300万Token）</NH2>
                  <div>
                    剩余 Token：
                    <n-tag type="info">
                      哪里都是你
                    </n-tag>
                  </div>
                  <div style="margin-top: 10px">
                    【开通GPT4】张老师 HTML 同学专享，含300万Token。限时，限购1次。
                  </div>
                  <div style="margin-top: 10px">
                    <NButton type="primary">
                      立即购买
                    </NButton>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card size="small">
                  <NH2>跟着张老师学 HTML（送300万Token）</NH2>
                  <div>
                    剩余 Token：
                    <n-tag type="info">
                      哪里都是你
                    </n-tag>
                  </div>
                  <div style="margin-top: 10px">
                    【开通GPT4】张老师 HTML 同学专享，含300万Token。限时，限购1次。
                  </div>
                  <div style="margin-top: 10px">
                    <NButton type="primary">
                      立即购买
                    </NButton>
                  </div>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card size="small">
                  <NH2>跟着张老师学 HTML（送300万Token）</NH2>
                  <div>
                    剩余 Token：
                    <n-tag type="info">
                      哪里都是你
                    </n-tag>
                  </div>
                  <div style="margin-top: 10px">
                    【开通GPT4】张老师 HTML 同学专享，含300万Token。限时，限购1次。
                  </div>
                  <div style="margin-top: 10px">
                    <NButton type="primary">
                      立即购买
                    </NButton>
                  </div>
                </n-card>
              </n-gi>
            </n-grid>
          </n-card>
        </div>
      </div>
    </div>
  </NSpin>
</template>
