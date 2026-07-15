<!-- src/views/PostListView.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardStorage } from '@/composables/useBoardStorage'

const route = useRoute()
const router = useRouter()
const { getPosts } = useBoardStorage()

// route.params.category → 주소창의 :category 부분 (예: "관광지")
const posts = computed(() => getPosts(route.params.category))
</script>

<template>
  <main class="post-list">
    <button
      type="button"
      class="back-link"
      @click="router.back()"
    >
      ← 장소 목록으로
    </button>

    <div class="post-list-header">
      <h2>{{ route.params.category }} 게시판</h2>

      <router-link
        :to="`/board/${route.params.category}/write`"
        class="write-button"
      >
        + 글쓰기
      </router-link>
    </div>

    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성일</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(post, index) in posts"
          :key="post.id"
        >
          <td>{{ index + 1 }}</td>

          <td>
            <router-link
              :to="`/board/${route.params.category}/${post.id}`"
            >
              {{ post.title }}
            </router-link>
          </td>

          <td>
            {{ new Date(post.createdAt).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>

    <p
      v-if="posts.length === 0"
      class="empty-message"
    >
      아직 작성된 글이 없습니다.
    </p>
  </main>
</template>

<style scoped>
.post-list {
  width: min(1000px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0;
}

.back-link {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 6px;
  margin-right: auto;
  margin-bottom: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: #4f64d8;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.back-link:hover {
  color: #3048b8;
  transform: translateX(-3px);
}

.post-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.post-list-header h2 {
  margin: 0;
}

.write-button {
  padding: 10px 18px;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.write-button:hover {
  background: #4f46e5;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

td a {
  color: inherit;
  text-decoration: none;
}

td a:hover {
  color: #6366f1;
  text-decoration: underline;
}

.empty-message {
  margin-top: 24px;
  color: #6b7280;
  text-align: center;
}
</style>