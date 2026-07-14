<script setup>
import { useRegionData } from '@/composables/useRegionData'

const { getByCategory } = useRegionData()

const categories = [
  { key: 'tourism', label: '관광지' },
  { key: 'culture', label: '문화시설' },
  { key: 'leisure', label: '레포츠' },
  { key: 'shopping', label: '쇼핑' },
  { key: 'lodging', label: '숙박' },
  { key: 'courses', label: '여행코스' },
  { key: 'festivals', label: '축제공연행사' },
]
</script>

<template>
  <main class="home">
    <section class="hero">
      <h1>지역 정보 공유 커뮤니티 LocalHub</h1>
      <p>서울의 생생한 정보를 한눈에 만나보세요</p>
    </section>

    <section class="category-grid">
      <router-link
        v-for="cat in categories"
        :key="cat.key"
        :to="`/board/${cat.key}`"
        class="category-card"
      >
        <h3>{{ cat.label }}</h3>
        <p>{{ getByCategory(cat.key).length }}건</p>
      </router-link>
    </section>
  </main>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 40px 20px;
  background: #eef2ff;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 24px;
}
.category-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  text-decoration: none;
  color: inherit;
}
.category-card:hover {
  border-color: #6366f1;
}
</style>