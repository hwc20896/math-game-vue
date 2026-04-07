<template>
  <div id="result-screen" class="screen">
    <div class="result-content">
      <h2 id="result-title" :style="{ color: resultColor }">{{ resultTitle }}</h2>
      <div class="result-details">
        <p>你的答案：<span id="user-result">{{ userResult }}</span></p>
        <p>正確答案：<span id="correct-result">{{ correctResult }}</span></p>
      </div>
      <div class="button-group">
        <button class="btn btn-replay" @click="replay">再玩一次</button>
        <button class="btn btn-new-game" @click="newGame">新遊戲</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

interface ResultProps {
  userX: number
  userY: number
  correctX: number
  correctY: number
  isCorrect: boolean
}

const props = defineProps<ResultProps>()
const emit = defineEmits<{
  replay: []
  newGame: []
}>()

const navigateTo = inject<(screen: string) => void>('navigateTo')

const resultTitle = computed(() => props.isCorrect ? '🎉 恭喜！' : '❌ 答案錯誤')
const resultColor = computed(() => props.isCorrect ? '#43e97b' : '#f5576c')
const userResult = computed(() => `(${props.userX}, ${props.userY})`)
const correctResult = computed(() => `(${props.correctX}, ${props.correctY})`)

const replay = () => {
  emit('replay')
  navigateTo?.('SetupScreen')
}

const newGame = () => {
  emit('newGame')
  navigateTo?.('MainMenu')
}
</script>

<style scoped>
.result-content {
  text-align: center;
  padding: 40px;
}

#result-title {
  font-size: 2rem;
  margin-bottom: 30px;
}

.result-details {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.result-details p {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
}

.result-details span {
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

#user-result {
  color: #f5576c;
}

#correct-result {
  color: #43e97b;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
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

.btn-replay {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.btn-new-game {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
</style>
