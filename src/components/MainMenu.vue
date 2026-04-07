<template>
  <div id="main-menu" class="screen active">
    <div class="menu-content">
      <button class="btn btn-play" @click="goToSetup">🎮 開始遊戲</button>
      <button class="btn btn-tutorial" @click="goToTutorial">📚 教學模式</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const navigateTo = inject<(screen: string) => void>('navigateTo')

const goToSetup = () => {
  navigateTo?.('SetupScreen')
}

const goToTutorial = () => {
  navigateTo?.('TutorialSelect')
}
</script>

<style scoped>
.menu-content {
  text-align: center;
  padding: 40px 20px;
}

.btn-play {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  font-size: 1.3rem;
  padding: 20px 60px;
  margin-bottom: 20px;
  display: block;
  width: 100%;
}

.btn-tutorial {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  font-size: 1.3rem;
  padding: 20px 60px;
  display: block;
  width: 100%;
}

.btn {
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
