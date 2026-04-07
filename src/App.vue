<template>
  <div class="container">
    <Header />

    <!-- 修正：明確傳遞 lessonId -->
    <component
        :is="currentScreen"
        v-if="currentScreenName === 'TutorialContent'"
        :lesson-id="tutorialLessonId"
        @game-start="handleGameStart"
        @answer-check="handleAnswerCheck"
        @lesson-select="handleLessonSelect"
        @replay="handleReplay"
        @new-game="handleNewGame"
    />

    <component
        :is="currentScreen"
        v-else-if="currentScreenName === 'GameScreen'"
        :original-x="gameData.originalX"
        :original-y="gameData.originalY"
        :current-x="gameData.currentX"
        :current-y="gameData.currentY"
        :transformations="gameData.transformations"
        @game-start="handleGameStart"
        @answer-check="handleAnswerCheck"
    />

    <component
        :is="currentScreen"
        v-else-if="currentScreenName === 'ResultScreen'"
        :user-x="resultData.userX"
        :user-y="resultData.userY"
        :correct-x="resultData.correctX"
        :correct-y="resultData.correctY"
        :is-correct="resultData.isCorrect"
        @replay="handleReplay"
        @new-game="handleNewGame"
    />

    <component
        :is="currentScreen"
        v-else
        @game-start="handleGameStart"
        @answer-check="handleAnswerCheck"
        @lesson-select="handleLessonSelect"
        @replay="handleReplay"
        @new-game="handleNewGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import Header from './components/Header.vue'
import MainMenu from './components/MainMenu.vue'
import SetupScreen from './components/SetupScreen.vue'
import TutorialSelect from './components/TutorialSelect.vue'
import TutorialContent from './components/TutorialContent.vue'
import GameScreen from './components/GameScreen.vue'
import ResultScreen from './components/ResultScreen.vue'

type ScreenName = 'MainMenu' | 'SetupScreen' | 'TutorialSelect' | 'TutorialContent' | 'GameScreen' | 'ResultScreen'

const currentScreenName = ref<ScreenName>('MainMenu')

// 移除 currentScreenProps，改用明確的 props
const currentScreen = computed(() => {
  const screens: Record<ScreenName, any> = {
    MainMenu,
    SetupScreen,
    TutorialSelect,
    TutorialContent,
    GameScreen,
    ResultScreen
  }
  return screens[currentScreenName.value]
})

const navigateTo = (screen: ScreenName) => {
  console.log('🧭 [App.vue] navigateTo:', screen)
  currentScreenName.value = screen

  setTimeout(() => {
    console.log('✅ [App.vue] 當前畫面:', currentScreenName.value)
  }, 50)
}

provide('navigateTo', navigateTo)

// 遊戲資料
const gameData = ref({
  originalX: 0,
  originalY: 0,
  currentX: 0,
  currentY: 0,
  transformations: [] as string[],
  iterationCount: 5
})

// 結果資料
const resultData = ref({
  userX: 0,
  userY: 0,
  correctX: 0,
  correctY: 0,
  isCorrect: false
})

// 教材資料 - 這個很重要！
const tutorialLessonId = ref('')

const handleGameStart = (data: any) => {
  console.log('🎮 [App.vue] handleGameStart:', data)
  gameData.value = data
  navigateTo('GameScreen')
}

const handleAnswerCheck = (userX: number, userY: number, correctX: number, correctY: number, isCorrect: boolean) => {
  console.log('✓ [App.vue] handleAnswerCheck:', { userX, userY, correctX, correctY, isCorrect })
  resultData.value = { userX, userY, correctX, correctY, isCorrect }
  navigateTo('ResultScreen')
}

const handleLessonSelect = (lessonId: string) => {
  console.log('📚 [App.vue] handleLessonSelect:', lessonId)

  if (!lessonId) {
    console.error('❌ [App.vue] lessonId 為空!')
    return
  }

  // 關鍵：先設定 tutorialLessonId，再切換畫面
  tutorialLessonId.value = lessonId
  console.log('💾 [App.vue] 已儲存 tutorialLessonId:', tutorialLessonId.value)

  setTimeout(() => {
    console.log('⏰ [App.vue] 延遲後 tutorialLessonId:', tutorialLessonId.value)
  }, 10)

  navigateTo('TutorialContent')
}

const handleReplay = () => {
  console.log('🔁 [App.vue] handleReplay')
  navigateTo('SetupScreen')
}

const handleNewGame = () => {
  console.log('🆕 [App.vue] handleNewGame')
  navigateTo('MainMenu')
}
</script>

<style scoped>
.container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
}
</style>
