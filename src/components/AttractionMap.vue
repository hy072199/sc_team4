<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 부모 컴포넌트에서 전달한 관광지 배열을 props로 받음
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

// 지도를 렌더링할 DOM 요소에 연결할 ref
const mapElement = ref(null)

// Leaflet 지도 객체를 저장할 변수
let map = null

// 마커를 그룹으로 묶어 관리하기 위한 레이어
let markerLayer = null

// 항목 배열에서 유효한 좌표만 추출하고 최대 20개까지 마커를 만듦
const createMarkers = () => {
  if (!map) return

  // 이전 마커가 있으면 제거
  if (markerLayer) {
    markerLayer.clearLayers()
  } else {
    markerLayer = L.layerGroup().addTo(map)
  }

  const validItems = props.items
    .map((item) => {
      const lat = Number(item.mapy)
      const lng = Number(item.mapx)

      // 위도나 경도가 숫자가 아니면 제외
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null
      }

      return { ...item, lat, lng }
    })
    .filter((item) => item !== null)
    .slice(0, 20)

  validItems.forEach((item) => {
    const marker = L.marker([item.lat, item.lng])

    // 마커 클릭 시 팝업에 title과 addr1을 표시
    const title = item.title || '이름 없음'
    const addr = item.addr1 || '주소 없음'
    marker.bindPopup(`<strong>${title}</strong><br>${addr}`)

    marker.addTo(markerLayer)
  })
}

onMounted(() => {
  // 컴포넌트가 마운트된 후에 지도 생성
  if (mapElement.value) {
    map = L.map(mapElement.value).setView([37.5665, 126.978], 12)

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    createMarkers()
  }
})

// items가 바뀌면 마커를 다시 생성
watch(
  () => props.items,
  () => {
    createMarkers()
  },
  { deep: true }
)

onUnmounted(() => {
  // 컴포넌트가 제거될 때 지도 객체도 함께 제거
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="attraction-map" ref="mapElement"></div>
</template>

<style scoped>
.attraction-map {
  width: 100%;
  height: 500px;
}
</style>