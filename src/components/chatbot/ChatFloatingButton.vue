<!-- src/components/chatbot/ChatFloatingButton.vue -->
<script setup>
import { ref } from 'vue'
import ChatWindow from './ChatWindow.vue'

const isOpen = ref(false)
</script>

<template>
  <div class="chat-widget">
    <ChatWindow v-if="isOpen" @close="isOpen = false" />
    <button class="fab" @click="isOpen = !isOpen">💬</button>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
}
.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #6366f1;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>