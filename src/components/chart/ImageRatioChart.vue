<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const chartData = computed(() => {
  const withImage = props.items.filter(item => item.firstimage).length
  const withoutImage = props.items.length - withImage

  return {
    labels: ['이미지 있음', '이미지 없음'],
    datasets: [
      {
        data: [withImage, withoutImage],
        backgroundColor: ['#6366f1', '#e5e4e7'],
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: '이미지 보유 현황' },
  },
}
</script>

<template>
  <div class="chart-box">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-box {
  max-width: 280px;
  margin: 0 auto;
}
</style>