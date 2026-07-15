<script setup>
import { useRegionData } from '@/composables/useRegionData'
import CategoryBarChart from '@/components/chart/CategoryBarChart.vue'

const { getByCategory } = useRegionData()

const categories = [
  { key: 'tourism', label: '관광지', icon: '🏞️' },
  { key: 'culture', label: '문화시설', icon: '🏛️' },
  { key: 'leisure', label: '레포츠', icon: '🚴' },
  { key: 'shopping', label: '쇼핑', icon: '🛍️' },
  { key: 'lodging', label: '숙박', icon: '🏨' },
  { key: 'courses', label: '여행코스', icon: '🗺️' },
  { key: 'festivals', label: '축제공연행사', icon: '🎉' },
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
        :to="`/explore/${cat.key}`"
        class="category-card"
>
        <div class="category-card-inner">
          <span class="category-icon">{{ cat.icon }}</span>
          <div class="category-text">
            <h3>{{ cat.label }}</h3>
            <p>{{ getByCategory(cat.key).length }}건</p>
          </div>
        </div>
      </router-link>
    </section>

    <section class="stats">
      <h2>권역 데이터 현황</h2>
      <CategoryBarChart />
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
.category-card-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.category-icon {
  font-size: 1.5rem;
  line-height: 1;
}
.category-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-text h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.stats {
  padding: 24px;
}
.stats h2 {
  margin-bottom: 12px;
}
</style>