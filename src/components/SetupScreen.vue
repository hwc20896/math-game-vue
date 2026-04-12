<template>
  <div id="setup-screen" class="screen">
    <div class="setup-content">
      <h2>選擇難度</h2>
      <div class="difficulty-buttons">
        <button
            v-for="(label, level) in difficulties"
            :key="level"
            :class="['btn', getDifficultyClass(level), { selected: difficulty === level }]"
            @click="selectDifficulty(level)"
        >
          {{ label }}
        </button>
      </div>

      <div v-if="showIterationInput" id="iteration-input">
        <label for="iteration-count">需要多少次變換？</label>
        <input
            type="number"
            id="iteration-count"
            min="1"
            max="20"
            step="1"
            v-model.number="iterationCount"
            :class="{ 'input-error': hasError }"
            @input="validateInput"
        >
        <p v-if="hasError" class="error-message">{{ errorMessage }}</p>
        <button class="btn btn-start" @click="startGame" :disabled="hasError">開始遊戲</button>
      </div>
      <button class="btn btn-back" @click="backToMain">← 返回選單</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, inject, watch} from 'vue'
import { TransformUtils, TransformResult } from '../utils/transform-utils'
import { difficulties, difficultyClasses } from "@/utils/constants.ts";
import { Point } from '@/utils/point.ts'

interface GameData {
  originalX: number
  originalY: number
  currentX: number
  currentY: number
  transformations: string[]
  iterationCount: number
}

const emit = defineEmits<{
  gameStart: [data: GameData]
}>()

const navigateTo = inject<(screen: string) => void>('navigateTo')

const difficulty = ref(1)
const iterationCount = ref(3)
const showIterationInput = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

const getDifficultyClass = (level: number): string => {
  return difficultyClasses[level] || ''
}

const selectDifficulty = (level: number) => {
  difficulty.value = level
  showIterationInput.value = true
  hasError.value = false
  errorMessage.value = ''
}

const validateInput = () => {
  if (!Number.isInteger(iterationCount.value)){
    hasError.value = true
    errorMessage.value = '變換次數必須是整數'
  }
  else if (iterationCount.value < 1 || iterationCount.value > 20) {
    hasError.value = true
    errorMessage.value = '請輸入 1 到 20 之間的數字'
  } else {
    hasError.value = false
    errorMessage.value = ''
  }
}

const startGame = () => {
  if (iterationCount.value < 1 || iterationCount.value > 20) {
    alert('請輸入 1 到 20 之間的數字')
    return
  }

  const originalX = TransformUtils.randInt(0, 10)
  const originalY = TransformUtils.randInt(0, 10)

  let currentX = originalX
  let currentY = originalY
  const transformations: string[] = []

  const options = TransformUtils.OPTIONS_DIFFICULTY[difficulty.value]
  let currentFunction: string | null = null
  const PROHIBIT_CONTINUOUS_FUNCTION = ['reflectByXAxis', 'reflectByYAxis', 'reflectBy45DegLine', 'reflectBy135DegLine']

  for (let i = 0; i < iterationCount.value; i++) {
    let target
    let attempts = 0

    do {
      target = TransformUtils.choice(options)
      attempts++
    } while (
      currentFunction === target.func.name &&
      PROHIBIT_CONTINUOUS_FUNCTION.includes(target.func.name) &&
      attempts < 10
    )

    if (PROHIBIT_CONTINUOUS_FUNCTION.includes(target.func.name)) {
      currentFunction = target.func.name
    } else {
      currentFunction = null
    }

    let result: TransformResult
    const currentPoint = new Point(currentX, currentY)

    if (target.argGen === null) {
      result = target.func(currentPoint)
    } else {
      const args = target.argGen()
      result = target.func(currentPoint, ...args)
    }

    currentX = TransformUtils.roundToDecimal(result.point.x, 2)
    currentY = TransformUtils.roundToDecimal(result.point.y, 2)
    transformations.push(result.description)
  }

  emit('gameStart', {
    originalX,
    originalY,
    currentX,
    currentY,
    transformations,
    iterationCount: iterationCount.value
  })

  navigateTo?.('GameScreen')
}

const backToMain = () => {
  showIterationInput.value = false
  difficulty.value = 1
  navigateTo?.('MainMenu')
}

watch(iterationCount, () => {
  console.log('iterationCount changed to ', iterationCount.value)
})
</script>

<style scoped>
.setup-content {
  text-align: center;
  padding: 40px;
}

.setup-content h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.difficulty-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn.selected {
  opacity: 1;
  transform: scale(1.05);
}

.btn-normal {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-hard {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.btn-hell {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.btn-extreme {
  background: linear-gradient(135deg, #fa709a, #fee140);
  color: white;
}

.btn-start {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  margin-top: 20px;
  width: 100%;
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-back {
  background: linear-gradient(135deg, #95a5a6, #bdc3c7);
  color: white;
  margin-top: 15px;
}

#iteration-input {
  margin-top: 30px;
}

#iteration-input label {
  display: block;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
}

#iteration-count {
  width: 100%;
  max-width: 200px;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 15px;
}

#iteration-count.input-error {
  border-color: #f5576c;
  background-color: #fff5f5;
}

.error-message {
  color: #f5576c;
  font-size: 0.9rem;
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
