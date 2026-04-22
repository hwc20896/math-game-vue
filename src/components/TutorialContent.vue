<template>
  <div id="tutorial-content-screen" class="screen">
    <div class="tutorial-content">
      <div class="tutorial-header">
        <button class="btn btn-small btn-back" @click="backToLessons">← 返回課程列表</button>
        <h2 id="tutorial-title">{{ tutorialData?.title }}</h2>
        <div class="difficulty-indicator" v-if="currentDifficultyLevels.length > 0">
          <span class="difficulty-label">出現於：</span>
          <span
              v-for="level in currentDifficultyLevels"
              :key="level"
              :class="['difficulty-badge', `level-${level}`]"
          >
            {{ getDifficultyLabel(level) }}
          </span>
        </div>
      </div>

      <div class="tutorial-body">
        <div class="tutorial-section">
          <h3>📖 這是什麼？</h3>
          <div class="explanation-box" v-html="tutorialData?.explanation"></div>
        </div>

        <div class="tutorial-section">
          <h3>📊 視覺演示：{{tutorialData?.demo.text}}</h3>
          <div class="visual-demo">
            <canvas ref="canvasRef" width="400" height="400"></canvas>
            <div class="demo-controls">
              <button class="btn btn-small btn-play" @click="playDemo">▶️ 播放動畫</button>
              <button class="btn btn-small" @click="resetDemo">🔄 重置</button>
            </div>
          </div>
        </div>

        <div class="tutorial-section">
          <h3>🧮 如何計算</h3>

          <!-- 使用 KaTeX 渲染公式 -->
          <div class="formula-box">
            <KatexFormula
                v-if="currentFormula"
                :formula="currentFormula"
                display-mode
            />
          </div>

          <div class="example-box">
            <div
                v-for="(step, index) in parsedExampleSteps"
                :key="index"
                class="example-step"
                v-html="step.html"
            ></div>
          </div>
        </div>

        <div class="tutorial-section">
          <h3>✏️ 練習題</h3>
          <div class="practice-box">
            <div class="practice-header">
              <p class="practice-question">{{ `${currentPractice?.question}新的坐標是什麼？` }}</p>
              <button class="btn btn-refresh" @click="refreshPractice" title="換一題">🔄 換一題</button>
            </div>
            <input
                type="text"
                v-model="practiceAnswer"
                placeholder="你的答案：(x, y)"
            >
            <button class="btn btn-submit" @click="checkPracticeAnswer">檢查答案</button>
            <div v-if="showFeedback" :class="['feedback', feedbackIsCorrect ? 'correct' : 'incorrect']">
              {{ feedbackMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import KatexFormula from './KatexFormula.vue'
import {latexFormulas, TUTORIAL_DATA, LESSON_DIFFICULTY_MAP} from "@/utils/constants.ts";
import {CanvaDrawing} from '@/utils/canva-drawing';
import katex from 'katex'
import {Point, Line} from '@/utils/point.ts'
import {TransformUtils} from "@/utils/transform-utils.ts";
import type {TutorialPracticeType} from "@/utils/tutorial-generator.ts";

const navigateTo = inject<(screen: string) => void>('navigateTo')

const props = defineProps<{
  lessonId?: string
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null)
const practiceAnswer = ref('')
const showFeedback = ref(false)
const feedbackIsCorrect = ref(false)
const feedbackMessage = ref('')
let tutorialAnimation: number | null = null

const currentDifficultyLevels = computed(() => {
  if (!props.lessonId) return []
  return LESSON_DIFFICULTY_MAP[props.lessonId] || []
})

const getDifficultyLabel = (level: number): string => {
  const labels: Record<number, string> = {
    1: '基礎',
    2: '進階',
    3: '困難',
    4: '地獄'
  }
  return labels[level] || `${level}`
}

const currentPractice = ref<TutorialPracticeType | null>(null)

const tutorialData = computed(() => {
  const id = props.lessonId
  if (!id) return null
  return TUTORIAL_DATA[id]
})

const generatePractice = () => {
  if (tutorialData.value?.practice) {
    currentPractice.value = tutorialData.value.practice()
    practiceAnswer.value = ''
    showFeedback.value = false
    feedbackIsCorrect.value = false
    feedbackMessage.value = ''
  }
}

watch(() => props.lessonId, (newId) => {
  if (newId) {
    generatePractice()
  }
}, { immediate: true })

const currentFormula = computed(() => {
  if (!tutorialData.value) return ''

  return latexFormulas[props.lessonId!] || ''
})

const parsedExampleSteps = computed(() => {
  if (!tutorialData.value?.example) return []

  const exampleHtml = tutorialData.value.example

  // 如果已經是包含 example-step 的 HTML，解析它
  const stepMatches = exampleHtml.match(/<div class="example-step">(.*?)<\/div>/g)

  if (stepMatches) {
    return stepMatches.map(stepHtml => {
      const content = stepHtml.replace(/<div class="example-step">(.*?)<\/div>/, '$1')

      // 檢查是否包含 $...$ 或 $$...$$ 語法
      const hasLatex = /\$\$(.+?)\$\$|\$(.+?)\$/g.test(content)

      if (hasLatex) {
        // 渲染包含 LaTeX 的內容
        const renderedContent = content.replace(/\$\$(.+?)\$\$/g, (match, formula) => {
          try {
            return katex.renderToString(formula, { displayMode: true })
          } catch (e) {
            return match
          }
        }).replace(/\$(.+?)\$/g, (match, formula) => {
          try {
            return katex.renderToString(formula, { displayMode: false })
          } catch (e) {
            return match
          }
        })

        return { html: renderedContent }
      } else {
        return { html: content }
      }
    })
  }

  // 如果不是 example-step 格式，將整個內容作為一個步驟
  return [{ html: exampleHtml }]
})

const drawFrame = (frame: number) => {
  if (!canvasRef.value || !tutorialData.value) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  const demoData = tutorialData.value.demo
  const range = demoData.gridRange || 5

  CanvaDrawing.drawGrid(ctx, canvasRef.value, range)

  const start = demoData.start
  let current: Point

  const cellSize = canvasRef.value.width / (range * 2)

  switch (demoData.type) {
    case 'move':{
      current = CanvaDrawing.handleMove(ctx, canvasRef.value, start, frame, demoData, cellSize)
      break
    }
    case 'scale':{
      current = CanvaDrawing.handleScale(ctx, canvasRef.value, start, frame, demoData, cellSize)
      break
    }
    case 'rotate':{
      const [angle] = demoData.params
      current = CanvaDrawing.handleRotate(ctx, canvasRef.value, start, frame, range, angle, cellSize)
      break
    }
    case 'reflect':{
      const [axis] = demoData.params
      const line = axis === 'x' ? new Line(0, 1, 0) : new Line(1, 0, 0)
      current = CanvaDrawing.handleReflect(ctx, canvasRef.value, start, line, frame, range, cellSize)
      break
    }
    case 'rotate_point': {
      const [point, angle] = demoData.params
      current = CanvaDrawing.handleRotate(ctx, canvasRef.value, start, frame, range, angle, cellSize, point)
      break
    }
    case 'reflect_line':{
      const [line] = demoData.params
      current = CanvaDrawing.handleReflect(ctx, canvasRef.value, start, line, frame, range, cellSize)
      break
    }
    default:{
      current = start
    }
  }

  CanvaDrawing.detail.drawPoint(ctx, canvasRef.value, start, '#667eea', 'Start', range)
  CanvaDrawing.detail.drawPoint(ctx, canvasRef.value, current, '#43e97b', 'Current', range, new Point(10, -25))

  CanvaDrawing.drawCurrentCoordinate(ctx, current, new Point(10, 20))
}

const playDemo = () => {
  if (tutorialAnimation) {
    cancelAnimationFrame(tutorialAnimation)
  }

  let frame = 0
  const totalFrames = 100

  const animate = () => {
    frame += 1
    const t = frame / totalFrames

    drawFrame(t)

    if (frame < totalFrames) {
      tutorialAnimation = requestAnimationFrame(animate)
    }
  }

  animate()
}

const resetDemo = () => {
  if (tutorialAnimation) {
    cancelAnimationFrame(tutorialAnimation)
  }
  drawFrame(0)
}

const checkPracticeAnswer = () => {
  if (!currentPractice.value) return

  const match = practiceAnswer.value.trim().match(/\(\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\)/)

  if (!match) {
    alert('請使用 (x, y) 格式輸入坐標。例如：(3, -5)')
    return
  }

  const userX = parseFloat(match[1])
  const userY = parseFloat(match[3])
  const correct = currentPractice.value.answer

  const isCorrect = TransformUtils.isCorrect(correct, new Point(userX, userY))

  showFeedback.value = true
  feedbackIsCorrect.value = isCorrect
  feedbackMessage.value = isCorrect
      ? '✅ 正確！做得好！'
      : `❌ 不太對。正確答案是 ${correct.toString()}`
}

const refreshPractice = () => {
  generatePractice()
}

const backToLessons = () => {
  navigateTo?.('TutorialSelect')
}

onMounted(() => {
  setTimeout(() => {
    resetDemo()
  }, 100)
})
</script>

<style scoped>
.tutorial-content {
  max-width: 100%;
  padding: 40px;
}

.tutorial-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.tutorial-header h2 {
  flex: 1;
  color: #333;
  font-size: 1.8rem;
}

.difficulty-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.difficulty-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: bold;
}

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.difficulty-badge.level-1 {
  background: linear-gradient(135deg, #C3E2C6, #D5E9C0);
  color: #333;
}

.difficulty-badge.level-2 {
  background: linear-gradient(135deg, #FFF3E0, #FFE6C7);
  color: #333;
}

.difficulty-badge.level-3 {
  background: linear-gradient(135deg, #FFE3E3, #FFC9C9);
  color: #333;
}

.difficulty-badge.level-4 {
  background: linear-gradient(135deg, #3B1E1E, #1A0E0E);
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-back {
  background: linear-gradient(135deg, #95a5a6, #bdc3c7);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.tutorial-body {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.tutorial-section h3 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.explanation-box {
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  padding: 25px;
  border-radius: 12px;
  border-left: 5px solid #667eea;
  line-height: 1.8;
  color: #333;
}

.formula-box {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 25px;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  margin-bottom: 20px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 覆蓋 KaTeX 的預設顏色為白色 */
.formula-box :deep(.katex) {
  color: white !important;
}

:deep(.katex .mord),
:deep(.katex .mop),
:deep(.katex .mbin),
:deep(.katex .mrel),
:deep(.katex .minner) {
  color: white;
}

.example-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.example-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.example-step {
  padding: 12px 15px;
  margin-bottom: 10px;
  background: white;
  border-left: 4px solid #667eea;
  border-radius: 6px;
  line-height: 1.8;
  color: #333;
  transition: all 0.2s ease;
}

.example-step:last-child {
  margin-bottom: 0;
}

.example-step:hover {
  background: #f0f4ff;
  border-left-color: #764ba2;
  transform: translateX(5px);
}

.example-step :deep(.katex) {
  color: #333;
  font-size: 1.05em;
}

.example-step :deep(.katex .mord),
.example-step :deep(.katex .mop),
.example-step :deep(.katex .mbin),
.example-step :deep(.katex .mrel),
.example-step :deep(.katex .minner) {
  color: #333;
}

.example-step :deep(.katex-display) {
  margin: 0.5em 0;
  overflow-x: auto;
  overflow-y: hidden;
}


.visual-demo {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

canvas {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
}

.demo-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.practice-box {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.practice-question {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #333;
  font-weight: bold;
}

.btn-refresh {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-refresh:active {
  transform: translateY(0);
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.feedback {
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 15px;
}

.feedback.correct {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.feedback.incorrect {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}
</style>
