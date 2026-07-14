<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main>
    <p>상세 화면 — category: {{ route.params.category }}, id: {{ route.params.id }}</p>
  </main>
</template>