<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main>
    <p>글쓰기 화면 — category: {{ route.params.category }}</p>
  </main>
</template>