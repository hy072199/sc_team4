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
    <h2>{{ route.params.category }} ({{ items.length }}건)</h2>
    <AttractionMap :items="items" />  <!-- ← 이 줄 추가 -->
    <div class="grid">
      <PlaceCard v-for="item in items" :key="item.contentid" :item="item" />
    </div>
  </main>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>