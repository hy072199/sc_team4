<script setup>
import { ref } from 'vue'
import { sendMessage } from '@/services/chatService'

const emit = defineEmits(['close'])
const messages = ref([
  { role: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
])
const input = ref('')
const loading = ref(false)

async function handleSend() {
  if (!input.value.trim()) return
  const userText = input.value
  messages.value.push({ role: 'user', text: userText })
  input.value = ''
  loading.value = true

  try {
    const res = await sendMessage(userText)
    if (res.error) {
      messages.value.push({ role: 'bot', text: `오류: ${res.error}` })
    } else {
      const reply = res.choices?.[0]?.message?.content ?? '응답을 받지 못했어요.'
      messages.value.push({ role: 'bot', text: reply })
    }
  } catch (e) {
    messages.value.push({ role: 'bot', text: '오류가 발생했어요. (네트워크 또는 API 키 문제일 수 있어요)' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="chat-window">
    <header>
      <span>LocalHub 챗봇</span>
      <button @click="emit('close')">✕</button>
    </header>

    <div class="messages">
      <div v-for="(m, i) in messages" :key="i" :class="['bubble', m.role]">
        {{ m.text }}
      </div>
      <div v-if="loading" class="bubble bot">답변 작성 중...</div>
    </div>

    <div class="input-area">
      <input
        v-model="input"
        placeholder="메시지를 입력하세요"
        @keyup.enter="handleSend"
      />
      <button @click="handleSend">전송</button>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  position: fixed;
  right: 20px;
  bottom: 90px;
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}
header {
  background: #6366f1;
  color: white;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
}
header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bubble {
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  font-size: 14px;
  white-space: pre-wrap;
}
.bubble.user {
  align-self: flex-end;
  background: #6366f1;
  color: white;
}
.bubble.bot {
  align-self: flex-start;
  background: #f1f1f1;
}
.input-area {
  display: flex;
  border-top: 1px solid #eee;
  padding: 8px;
  flex-shrink: 0;
}
.input-area input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 10px;
}
.input-area button {
  margin-left: 6px;
  padding: 6px 12px;
  border: none;
  background: #6366f1;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

/* RFP 요구사항: 모바일에서는 전체 화면으로 표시 */
@media (max-width: 480px) {
  .chat-window {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>