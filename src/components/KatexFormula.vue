<template>
  <span
      class="katex-formula"
      v-html="renderedHtml"
  ></span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  formula: string
  displayMode?: boolean
  errorColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  displayMode: false,
  errorColor: '#cc0000'
})

const renderedHtml = ref('')

const renderKatex = () => {
  try {
    renderedHtml.value = katex.renderToString(props.formula, {
      displayMode: props.displayMode,
      output: 'html',
      throwOnError: false,
      errorColor: props.errorColor,
      macros: {
        '\\RR': '\\mathbb{R}',
        '\\NN': '\\mathbb{N}'
      }
    })
  } catch (error) {
    console.error('KaTeX 渲染錯誤:', error)
    renderedHtml.value = `<span style="color: ${props.errorColor}">公式渲染失敗</span>`
  }
}

// 監聽 formula 變化，重新渲染
watch(() => props.formula, renderKatex, { immediate: true })
</script>

<style scoped>
.katex-formula {
  font-size: 1.1em;
  line-height: 1.2;
}

:deep(.katex) {
  font-size: 1.1em;
}

:deep(.katex-display) {
  margin: 1em 0;
  padding: 0.5em;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
