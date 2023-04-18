<script setup lang='ts'>
import {NSpin} from 'naive-ui'
import pkg from '@/../package.json'
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">
      Version - {{ pkg.version }}
    </h2>
    <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
      <p>
        本项目基于
        <a
          class="text-blue-600 dark:text-blue-500"
          href="https://github.com/Chanzhaoyu/chatgpt-web"
          target="_blank"
        >
          Github：Chanzhaoyu/chatgpt-web
        </a>
        ，二次开发！
      </p>
      <p>
        本项目地址
        <a class="text-blue-600 dark:text-blue-500"
           href="https://github.com/cike-projects/chatgpt-web"
           target="_blank"
        >
          Github：cike-projects/chatgpt-web
        </a>
      </p>
      <p>
        如果你觉得此项目对你有帮助，请在 Github 帮我点个 Star 或者给予一点赞助，谢谢！
      </p>
    </div>
  </div>
</template>
