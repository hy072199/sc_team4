<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRegionData } from '@/composables/useRegionData'
import PlaceCard from '@/components/common/PlaceCard.vue'
import DistrictChart from '@/components/chart/DistrictChart.vue'

const route = useRoute()
const { getByCategory } = useRegionData()

const items = computed(() => getByCategory(route.params.category))
</script>

<template>
  <main class="board-list">
    <h2>{{ route.params.category }} ({{ items.length }}건)</h2>

    <section class="charts">
      <DistrictChart :items="items" />
    </section>

    <div class="grid">
      <PlaceCard v-for="item in items" :key="item.contentid" :item="item" />
    </div>
  </main>
</template>

<style scoped>
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px;
  justify-content: center;
  border-bottom: 1px solid #e5e4e7;
  margin-bottom: 16px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>