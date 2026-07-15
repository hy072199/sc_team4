<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardStorage } from '@/composables/useBoardStorage'

const route = useRoute()
const router = useRouter()
const { getPostById, deletePost } = useBoardStorage()

const category = route.params.category
const postId = route.params.id

const post = computed(() => getPostById(category, postId))

const modalMode = ref(null) // null | 'edit' | 'delete'
const passwordInput = ref('')
const modalError = ref('')

function openModal(mode) {
  modalMode.value = mode
  passwordInput.value = ''
  modalError.value = ''
}

function closeModal() {
  modalMode.value = null
}

function confirmModal() {
  if (!passwordInput.value.trim()) {
    modalError.value = '비밀번호를 입력해주세요.'
    return
  }

  if (modalMode.value === 'delete') {
    const result = deletePost(category, postId, passwordInput.value)
    if (result?.error) {
      modalError.value = result.error
      return
    }
    router.push(`/board/${category}`)
  } else if (modalMode.value === 'edit') {
    // 삭제와 달리 수정은 실제 저장 로직이 BoardWriteView에 있으므로
    // 여기서는 비밀번호 일치 여부만 간단 확인 후 이동
    if (post.value.password !== passwordInput.value) {
      modalError.value = '비밀번호가 일치하지 않습니다.'
      return
    }
    router.push(`/board/${category}/${postId}/edit`)
  }
}
</script>

<template>
  <main class="post-detail">
    <router-link :to="`/board/${category}`" class="back-link">목록으로</router-link>

    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p class="meta">작성일: {{ new Date(post.createdAt).toLocaleDateString() }}</p>

      <div class="content">{{ post.content }}</div>

      <div class="actions">
        <button class="btn-edit" @click="openModal('edit')">수정</button>
        <button class="btn-delete" @click="openModal('delete')">삭제</button>
      </div>
    </div>

    <p v-else class="not-found">글을 찾을 수 없습니다.</p>

    <!-- 비밀번호 확인 모달 -->
    <div v-if="modalMode" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>비밀번호 확인</h3>
        <input
          v-model="passwordInput"
          type="password"
          placeholder="비밀번호 입력"
          @keyup.enter="confirmModal"
        />
        <p v-if="modalError" class="modal-error">{{ modalError }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">취소</button>
          <button class="btn-confirm" @click="confirmModal">확인</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.post-detail {
  width: min(700px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
}

.meta {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

.content {
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 20px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.btn-edit {
  background: #f3f4f6;
  color: #374151;
}

.btn-delete {
  background: #fee2e2;
  color: #b91c1c;
}

.not-found {
  text-align: center;
  color: #6b7280;
  padding: 60px 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
}

.modal h3 {
  margin: 0 0 16px;
}

.modal input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-sizing: border-box;
}

.modal-error {
  color: #b91c1c;
  font-size: 13px;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.modal-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-confirm {
  background: #6366f1;
  color: white;
}
</style>