<template>
  <div id="game-screen" class="screen">
    <div class="game-info">
      <div class="coordinate-display">
        <span class="original-coord">起始坐標：{{original.toString()}}</span>
      </div>
      <div class="transformation-log">
        <h3>變換步驟：</h3>
        <ul id="transform-list">
          <li v-for="(transform, index) in transformations" :key="index">
            {{ index + 1 }}. {{ transform }}
          </li>
        </ul>
      </div>
    </div>

    <div class="answer-section">
      <label for="user-answer">最終坐標是什麼？(x, y)</label>
      <input
          type="text"
          id="user-answer"
          v-model="userAnswer"
          placeholder="例如：(3, -5)"
          @keyup.enter="checkAnswer"
      >
      <button class="btn btn-submit" @click="checkAnswer">提交答案</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Point } from '@/utils/point.ts'
import {TransformUtils} from "@/utils/transform-utils.ts";

interface GameProps {
  original: Point
  current: Point
  transformations: string[]
}

const props = defineProps<GameProps>()
const emit = defineEmits<{
  answerCheck: [user: Point, correct: Point, isCorrect: boolean]
}>()

const navigateTo = inject<(screen: string) => void>('navigateTo')

const userAnswer = ref('')

const checkAnswer = () => {
  const match = userAnswer.value.trim().match(/\(\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\)/)

  if (!match) {
    alert('請使用 (x, y) 格式輸入坐標。例如：(3, -5)')
    return
  }

  const userX = parseFloat(match[1])
  const userY = parseFloat(match[3])

  const user = new Point(userX, userY)

  emit('answerCheck', user, props.current, TransformUtils.isCorrect(user, props.current))
  navigateTo?.('ResultScreen')
}
</script>

<style scoped>.game-info {
  margin-bottom: 30px;
}

.coordinate-display {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2rem;
}

.transformation-log {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.transformation-log h3 {
  color: #333;
  margin-bottom: 15px;
}

#transform-list {
  list-style: none;
  padding: 0;
}

#transform-list li {
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  color: #333;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.answer-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
}

.answer-section label {
  display: block;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
}

#user-answer {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: 'Courier New', monospace;
  box-sizing: border-box;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  margin-top: 15px;
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}
</style>