<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRegionData } from '@/composables/useRegionData'
import PlaceCard from '@/components/common/PlaceCard.vue'
import AttractionMap from '@/components/AttractionMap.vue'
import DistrictChart from '@/components/chart/DistrictChart.vue'

const route = useRoute()
const { getByCategory } = useRegionData()

const categoryLabels = {
  tourism: '관광지',
  culture: '문화시설',
  restaurant: '음식점',
  shopping: '쇼핑',

  leisure: '레포츠',
  leports: '레포츠',

  accommodation: '숙박',
  lodging: '숙박',
  stay: '숙박',

  course: '여행코스',
  courses: '여행코스',
  travelcourse: '여행코스',
  'travel-course': '여행코스',
  travelCourse: '여행코스',

  festival: '축제·공연·행사',
  festivals: '축제·공연·행사',
  event: '축제·공연·행사',
  performance: '축제·공연·행사',
  festivalEvent: '축제·공연·행사',
  'festival-event': '축제·공연·행사',
  'festival-performance-event': '축제·공연·행사',
}

const categoryLabel = computed(() => {
  return categoryLabels[route.params.category] ?? route.params.category
})

// 현재 카테고리에 해당하는 전체 장소 목록
const items = computed(() => getByCategory(route.params.category))

// 현재 선택한 자치구
// 빈 문자열이면 아무 자치구도 선택하지 않은 상태
const selectedDistrict = ref('')

// 서울 25개 자치구 목록
const districts = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
]

// 지도에 전달할 장소 목록
const mapItems = computed(() => {
  // 자치구를 선택하지 않았으면 빈 배열 전달
  if (!selectedDistrict.value) {
    return []
  }

  // 주소에 선택한 자치구가 포함된 장소만 반환
  return items.value.filter((item) =>
    item.addr1?.includes(selectedDistrict.value),
  )
})
</script>

<template>
  <main class="board-list">
    <router-link to="/" class="back-link">
      ← 전체 카테고리
    </router-link>

    <section class="board-cta">
      <div class="board-cta-text">
        <p class="board-cta-title">
          이 지역 주민·여행자들과 정보를 나눠보세요
        </p>

        <p class="board-cta-sub">
          직접 남긴 후기와 팁을 커뮤니티 게시판에서 확인할 수 있어요.
        </p>
      </div>

      <router-link
        :to="`/board/${route.params.category}`"
        class="board-cta-button"
      >
        게시판 바로가기 →
      </router-link>
    </section>

    <header class="page-header">
      <p class="page-label">
        서울 지역 정보
      </p>

      <div class="title-row">
        <h2>{{ categoryLabel }}</h2>

        <span class="item-count">
          {{ items.length }}건
        </span>
      </div>
    </header>

    <section class="map-section">
      <div class="section-header">
        <div>
          <p class="section-label">
            MAP
          </p>

          <h3>
            지도에서 위치 확인
          </h3>
        </div>

        <div class="map-controls">
          <span class="map-guide">
            자치구를 선택하면 장소의 위치를 볼 수 있어요.
          </span>

          <select
            v-model="selectedDistrict"
            class="district-select"
          >
            <option value="">
              자치구 선택
            </option>

            <option
              v-for="district in districts"
              :key="district"
              :value="district"
            >
              {{ district }}
            </option>
          </select>
        </div>
      </div>

      <AttractionMap :items="mapItems" />
    </section>

    <section class="stats-section">
      <div class="section-header">
        <div>
          <p class="section-label">
            STATS
          </p>

          <h3>
            자치구별 분포
          </h3>
        </div>
      </div>

      <DistrictChart :items="items" />
    </section>

    <section class="place-section">
      <div class="section-header">
        <div>
          <p class="section-label">
            PLACES
          </p>

          <h3>
            장소 목록
          </h3>
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
  margin-top: 32px;
  margin-bottom: 32px;
}

.back-link {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 6px;
  margin-right: auto;
  margin-bottom: 20px;
  color: #4f64d8;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.back-link:hover {
  color: #3048b8;
  transform: translateX(-3px);
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

.board-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 48px;
  padding: 20px 24px;
  border: 1px solid #c7d2fe;
  border-radius: 16px;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
}

.board-cta-title {
  margin: 0 0 4px;
  color: #312e81;
  font-size: 16px;
  font-weight: 700;
}

.board-cta-sub {
  margin: 0;
  color: #4c4a8f;
  font-size: 14px;
}

.board-cta-button {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 12px 20px;
  border-radius: 10px;
  background: #6366f1;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.board-cta-button:hover {
  background: #4f46e5;
}

.map-section,
.stats-section,
.place-section {
  margin-top: 36px;
}

.map-section,
.stats-section {
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

.map-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.map-guide {
  color: #6b7280;
  font-size: 14px;
}

.district-select {
  min-width: 140px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  cursor: pointer;
}

.district-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
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

  .page-header {
    margin-top: 24px;
  }

  .back-link {
    margin-bottom: 14px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .map-controls {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .district-select {
    width: 100%;
  }

  .map-section,
  .stats-section {
    padding: 16px;
    border-radius: 16px;
  }

  .board-cta {
  width: 100%;
  box-sizing: border-box;
  align-items: stretch;
  flex-direction: column;
  margin-top: 24px;
  padding: 20px;
}

.board-cta-button {
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  white-space: normal;
}

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>