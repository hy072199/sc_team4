<!-- src/components/chart/CategoryBarChart.vue -->
<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useRegionData } from '@/composables/useRegionData'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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

const chartData = computed(() => ({
  labels: categories.map((c) => c.label),
  datasets: [
    {
      label: '카테고리별 데이터 건수',
      data: categories.map((c) => getByCategory(c.key).length),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: '서울 권역 카테고리별 데이터 현황',
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
}
</script>

<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  max-width: 800px;
  margin: 24px auto;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e4e7;
}
</style>