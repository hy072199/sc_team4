<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardStorage } from '@/composables/useBoardStorage'

const route = useRoute()
const router = useRouter()
const { addPost, getPostById, updatePost } = useBoardStorage()

const category = route.params.category
const postId = route.params.id // 없으면 작성 모드, 있으면 수정 모드
const isEditMode = !!postId

const title = ref('')
const content = ref('')
const password = ref('')
const errorMessage = ref('')

onMounted(() => {
  if (isEditMode) {
    const post = getPostById(category, postId)
    if (post) {
      title.value = post.title
      content.value = post.content
      // 비밀번호는 보안상 미리 채워넣지 않음, 사용자가 다시 입력해야 함
    } else {
      errorMessage.value = '글을 찾을 수 없습니다.'
    }
  }
})

function handleSubmit() {
  errorMessage.value = ''

  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = '제목과 내용을 입력해주세요.'
    return
  }
  if (!password.value.trim()) {
    errorMessage.value = '비밀번호를 입력해주세요.'
    return
  }

  if (isEditMode) {
    const result = updatePost(category, postId, title.value, content.value, password.value)
    if (result?.error) {
      errorMessage.value = result.error
      return
    }
    router.push(`/board/${category}/${postId}`)
  } else {
    const post = addPost(category, title.value, content.value, password.value)
    router.push(`/board/${category}/${post.id}`)
  }
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <main class="write-form">
    <h2>{{ isEditMode ? '글 수정' : '글쓰기' }}</h2>
    <p class="category-label">{{ category }} 게시판</p>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="field">
      <label>제목</label>
      <input v-model="title" type="text" placeholder="제목을 입력하세요" />
    </div>

    <div class="field">
      <label>내용</label>
      <textarea v-model="content" rows="10" placeholder="내용을 입력하세요"></textarea>
    </div>

    <div class="field">
      <label>수정용 비밀번호</label>
      <input v-model="password" type="password" placeholder="숫자 4자리 이상" />
    </div>

    <div class="actions">
      <button class="btn-cancel" @click="handleCancel">취소</button>
      <button class="btn-submit" @click="handleSubmit">
        {{ isEditMode ? '수정 완료' : '등록' }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.write-form {
  width: min(700px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0;
}

.category-label {
  color: #6b7280;
  margin-bottom: 24px;
}

.error-message {
  padding: 10px 14px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.field textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.actions button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-submit {
  background: #6366f1;
  color: white;
}

.btn-submit:hover {
  background: #4f46e5;
}
</style>