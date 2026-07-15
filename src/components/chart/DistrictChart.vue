<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

function extractDistrict(addr1) {
  if (!addr1) return null
  const match = addr1.match(/([가-힣]+구)/)
  return match ? match[1] : null
}

const chartData = computed(() => {
  const counts = {}
  props.items.forEach(item => {
    const district = extractDistrict(item.addr1)
    if (!district) return
    counts[district] = (counts[district] || 0) + 1
  })

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return {
    labels: sorted.map(([district]) => district),
    datasets: [
      {
        label: '항목 수',
        data: sorted.map(([, count]) => count),
        backgroundColor: '#22c55e',
        borderRadius: 4,
      },
    ],
  }
})

// 막대 개수에 맞춰 차트 높이를 동적으로 계산 (핵심 수정)
const chartHeight = computed(() => {
  const barCount = chartData.value.labels.length
  return Math.max(barCount * 36, 200)
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,   // 이게 없으면 컨테이너 높이 무시하고 자체 비율로 그림
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    title: { display: true, text: '자치구별 분포 (상위 10개)' },
  },
}
</script>

<template>
  <div class="chart-box" :style="{ height: chartHeight + 'px' }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-box {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
</style>