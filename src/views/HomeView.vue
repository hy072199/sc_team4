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
  <div class="home-page">
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
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  background: #eee7d5;
}

.home {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0 72px;
  background: transparent;
}

.hero {
  padding: 48px 24px;
  border: 1px solid #dfe3f8;
  border-radius: 20px;
  background: linear-gradient(135deg, #eef2ff, #e7eaff);
  text-align: center;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.hero h1 {
  margin: 0;
  color: #1f2937;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.25;
}

.hero p {
  margin: 14px 0 0;
  color: #5f6574;
  font-size: 16px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 24px;
}

.category-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.category-card:hover {
  border-color: #6366f1;
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(79, 70, 229, 0.12);
}

.category-card-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.category-icon {
  display: flex;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #f1f3ff;
  font-size: 1.7rem;
  line-height: 1;
}

.category-text {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.category-text h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.stats {
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.stats h2 {
  margin: 0 0 16px;
  color: #1f2937;
  font-size: 22px;
}

@media (max-width: 640px) {
  .home {
    width: min(100% - 20px, 1200px);
    padding: 28px 0 48px;
  }

  .hero {
    padding: 36px 18px;
    border-radius: 16px;
  }

  .category-grid {
    grid-template-columns: 1fr;
    padding: 24px 0;
  }

  .stats {
    padding: 18px;
    border-radius: 16px;
  }
}
</style>