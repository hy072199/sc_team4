<!-- src/views/PostListView.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardStorage } from '@/composables/useBoardStorage'

const route = useRoute()
const { getPosts } = useBoardStorage()

// route.params.category → 주소창의 :category 부분 (예: "관광지")
const posts = computed(() => getPosts(route.params.category))
</script>

<template>
  <main class="post-list">
    <h2>{{ route.params.category }} 게시판</h2>

    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="post.id">
          <td>{{ index + 1 }}</td>
          <td>{{ post.title }}</td>
          <td>{{ new Date(post.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="posts.length === 0">아직 작성된 글이 없습니다.</p>
  </main>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
</style>