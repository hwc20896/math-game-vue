<template>
  <div id="tutorial-select-screen" class="screen">
    <div class="tutorial-select-content">
      <h2>📚 選擇教學課程</h2>
      <div class="lesson-grid">
        <button
            v-for="lesson in lessons"
            :key="lesson.id"
            :class="['lesson-card', lesson.level]"
            @click="selectLesson(lesson.id)"
        >
          <div class="lesson-icon">{{ lesson.icon }}</div>
          <h3>{{ lesson.title }}</h3>
          <p>{{ lesson.description }}</p>
          <div class="lesson-footer">
            <span v-if="lesson.level !== 'basic'" class="advanced-badge">
              {{ getLevelText(lesson.level) }}
            </span>
            <div class="difficulty-tags">
              <span
                  v-for="level in getDifficultyLevels(lesson.id)"
                  :key="level"
                  :class="['difficulty-tag', `level-${level}`]"
              >
                {{ level }}
              </span>
            </div>
          </div>
        </button>
      </div>
      <button class="btn btn-back" @click="backToMain">← 返回選單</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

import {lessons, LESSON_DIFFICULTY_MAP} from "@/utils/constants.ts";

const navigateTo = inject<(screen: string) => void>('navigateTo')
const emit = defineEmits<{
  lessonSelect: [lessonId: string]
}>()

const getLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    advanced: '進階',
    expert: '專家'
  }
  return texts[level] || ''
}

const getDifficultyLevels = (lessonId: string): number[] => {
  return LESSON_DIFFICULTY_MAP[lessonId] || []
}

const selectLesson = (lessonId: string) => {
  emit('lessonSelect', lessonId)
  navigateTo?.('TutorialContent')
}

const backToMain = () => {
  navigateTo?.('MainMenu')
}
</script>

<style scoped>
.tutorial-select-content {
  text-align: center;
  padding: 40px;
}

.tutorial-select-content h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.lesson-card {
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.lesson-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.lesson-card h3 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.lesson-card p {
  color: #666;
  font-size: 0.9rem;
}

.lesson-card.basic {
  border-color: #66ea7e;
  background: linear-gradient(135deg, #eefff2, #ffffff);
}

.lesson-card.advanced {
  border-color: #f5576c;
  background: linear-gradient(135deg, #fff5f5, #ffffff);
}

.lesson-card.expert {
  border-color: #f093fb;
  background: linear-gradient(135deg, #fdf5ff, #ffffff);
}

.advanced-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f5576c, #f093fb);
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-top: 10px;
  font-weight: bold;
}

.difficulty-tags {
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
}

.difficulty-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  margin-top: 0.5rem;
}

.difficulty-tag.level-1 {
  background: linear-gradient(135deg, #C3E2C6, #D5E9C0);
  color: #333;
}

.difficulty-tag.level-2 {
  background: linear-gradient(135deg, #FFF3E0, #FFE6C7);
  color: #333;
}

.difficulty-tag.level-3 {
  background: linear-gradient(135deg, #FFE3E3, #FFC9C9);
  color: #333;
}

.difficulty-tag.level-4 {
  background: linear-gradient(135deg, #3B1E1E, #1A0E0E);
}

.btn-back {
  background: linear-gradient(135deg, #95a5a6, #bdc3c7);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}
</style>
