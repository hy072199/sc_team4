<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { sendMessage } from '@/services/chatService'

const emit = defineEmits(['close'])

const messages = ref([
  { role: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
])

const input = ref('')
const loading = ref(false)

// 챗봇 창의 현재 위치
const position = ref({
  x: Math.max(20, window.innerWidth - 500),
  y: Math.max(20, window.innerHeight - 650),
})

// 드래그 중인지 여부
const isDragging = ref(false)

// 드래그를 시작할 때 마우스와 창 사이의 간격
const dragOffset = ref({
  x: 0,
  y: 0,
})

async function handleSend() {
  if (!input.value.trim()) return

  const userText = input.value
  messages.value.push({
    role: 'user',
    text: userText,
  })

  input.value = ''
  loading.value = true

  try {
    const res = await sendMessage(userText)

    if (res.error) {
      messages.value.push({
        role: 'bot',
        text: `오류: ${res.error}`,
      })
    } else {
      const reply =
        res.choices?.[0]?.message?.content ??
        '응답을 받지 못했어요.'

      messages.value.push({
        role: 'bot',
        text: reply,
      })
    }
  } catch (e) {
    messages.value.push({
      role: 'bot',
      text: '오류가 발생했어요. (네트워크 또는 API 키 문제일 수 있어요)',
    })
  } finally {
    loading.value = false
  }
}

// 챗봇 헤더를 눌렀을 때 드래그 시작
function startDragging(event) {
  // 모바일에서는 드래그 기능 사용하지 않음
  if (window.innerWidth <= 480) return

  isDragging.value = true

  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y,
  }

  window.addEventListener('mousemove', handleDragging)
  window.addEventListener('mouseup', stopDragging)
}

// 마우스를 움직일 때 챗봇 위치 변경
function handleDragging(event) {
  if (!isDragging.value) return

  const chatWidth = 440
  const chatHeight = 560

  const nextX = event.clientX - dragOffset.value.x
  const nextY = event.clientY - dragOffset.value.y

  // 화면 밖으로 나가지 않도록 위치 제한
  position.value = {
    x: Math.min(
      Math.max(0, nextX),
      window.innerWidth - chatWidth,
    ),
    y: Math.min(
      Math.max(0, nextY),
      window.innerHeight - chatHeight,
    ),
  }
}

// 마우스를 놓으면 드래그 종료
function stopDragging() {
  isDragging.value = false

  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
}

// 컴포넌트가 사라질 때 이벤트 정리
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
})
</script>

<template>
  <div
    class="chat-window"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <header
      :class="{ dragging: isDragging }"
      @mousedown="startDragging"
    >
      <span>LocalHub 챗봇</span>

      <button
        type="button"
        aria-label="챗봇 닫기"
        @mousedown.stop
        @click="emit('close')"
      >
        ✕
      </button>
    </header>

    <div class="messages">
      <div
        v-for="(m, i) in messages"
        :key="i"
        :class="['bubble', m.role]"
      >
        {{ m.text }}
      </div>

      <div
        v-if="loading"
        class="bubble bot"
      >
        답변 작성 중...
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="input"
        placeholder="메시지를 입력하세요"
        @keyup.enter="handleSend"
      />

      <button
        type="button"
        @click="handleSend"
      >
        전송
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  position: fixed;
  width: 440px;
  height: 560px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}

header {
  background: #6366f1;
  color: white;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  cursor: grab;
  user-select: none;
}

header.dragging {
  cursor: grabbing;
}

header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bubble {
  padding: 10px 14px;
  border-radius: 14px;
  max-width: 80%;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.bubble.user {
  align-self: flex-end;
  background: #6366f1;
  color: white;
}

.bubble.bot {
  align-self: flex-start;
  background: #f1f1f1;
  color: #111827;
}

.input-area {
  display: flex;
  gap: 8px;
  border-top: 1px solid #eee;
  padding: 12px;
  flex-shrink: 0;
}

.input-area input {
  flex: 1;
  min-width: 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.input-area input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.input-area button {
  padding: 10px 16px;
  border: none;
  background: #6366f1;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}

/* 모바일에서는 화면 전체를 덮지 않고, 하단에 여백을 둔 카드 형태로 표시 */
@media (max-width: 480px) {
  .chat-window {
    left: 12px !important;
    right: 12px;
    top: auto !important;
    bottom: 88px !important;
    width: auto;
    height: min(65vh, 520px);
    border-radius: 16px;
  }

  header {
    cursor: default;
  }
}
</style>