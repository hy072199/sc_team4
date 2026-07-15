<!-- src/views/BoardListView.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRegionData } from '@/composables/useRegionData'
import PlaceCard from '@/components/common/PlaceCard.vue'
import AttractionMap from '@/components/AttractionMap.vue'

const route = useRoute()
const { getByCategory } = useRegionData()

const items = computed(() => getByCategory(route.params.category))
</script>

<template>
  <main class="board-list">
    <header class="page-header">
      <p class="page-label">서울 지역 정보</p>

      <div class="title-row">
        <h2>{{ route.params.category }}</h2>
        <span class="item-count">{{ items.length }}건</span>
      </div>

      <p class="page-description">
        지도에서 위치를 확인하고 원하는 장소 정보를 살펴보세요.
      </p>
    </header>

    <section class="map-section">
      <div class="section-header">
        <div>
          <p class="section-label">MAP</p>
          <h3>지도에서 위치 확인</h3>
        </div>

        <span class="map-guide">핀을 클릭하면 장소 정보를 볼 수 있어요.</span>
      </div>

      <AttractionMap :items="items" />
    </section>

    <section class="place-section">
      <div class="section-header">
        <div>
          <p class="section-label">PLACES</p>
          <h3>장소 목록</h3>
        </div>
      </div>

      <div class="grid">
        <PlaceCard
          v-for="item in items"
          :key="item.contentid"
          :item="item"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.board-list {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0 72px;
}

.page-header {
  margin-bottom: 32px;
}

.page-label,
.section-label {
  margin: 0 0 8px;
  color: #5b7cfa;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-row h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.2;
}

.item-count {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f64d8;
  font-size: 14px;
  font-weight: 700;
}

.page-description {
  margin: 14px 0 0;
  color: #6b7280;
  font-size: 16px;
}

.map-section,
.place-section {
  margin-top: 36px;
}

.map-section {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-header h3 {
  margin: 0;
  font-size: 22px;
}

.map-guide {
  color: #6b7280;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

@media (max-width: 640px) {
  .board-list {
    width: min(100% - 20px, 1200px);
    padding: 32px 0 48px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .map-section {
    padding: 16px;
    border-radius: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>