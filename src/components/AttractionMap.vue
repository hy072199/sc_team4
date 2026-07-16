<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// 부모 컴포넌트에서 전달한 관광지 배열을 props로 받음
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

// 지도를 렌더링할 DOM 요소에 연결할 ref
const mapElement = ref(null)

// Leaflet 지도 객체를 저장할 변수 (전역 스코프에 한 번만 선언)
let map = null

// 마커들을 담을 레이어 그룹 (마커 관리를 쉽게 하기 위함)
let markerLayer = null

// 기본 서울 중심 좌표와 기본 줌
const DEFAULT_CENTER = [37.5665, 126.978]
const DEFAULT_ZOOM = 12

// 항목 배열에서 유효한 좌표만 추출하고 최대 20개까지 마커를 만듦
const createMarkers = () => {
  // 지도가 생성되지 않았으면 아무것도 하지 않음
  if (!map) return

  // 기존 마커 레이어가 있으면 초기화, 없으면 생성하여 지도에 추가
  if (markerLayer) {
    markerLayer.clearLayers()
  } else {
    markerLayer = L.layerGroup().addTo(map)
  }

  // props.items에서 위도(mapy)와 경도(mapx)를 숫자로 변환하고 유효성 검사
  const validItems = props.items
    .map((item) => {
      const lat = Number(item.mapy) // mapy는 위도
      const lng = Number(item.mapx) // mapx는 경도

      // 숫자가 아니거나 유한하지 않으면 무시
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null
      }

      return { ...item, lat, lng }
    })
    .filter((it) => it !== null)
    .slice(0, 20) // 성능 확인을 위해 앞의 20개만 사용

  // 마커의 좌표들을 수집 (fitBounds에 사용)
  const coords = []

  validItems.forEach((item) => {
    // Leaflet은 [lat, lng] 순서를 사용
    const latlng = L.latLng(item.lat, item.lng)
    coords.push(latlng)

    // 마커 생성
    const marker = L.marker(latlng)

    // 팝업 내용: title과 addr1 (없을 경우 대체 텍스트)
    const title = item.title || '이름 없음'
    const addr = item.addr1 || '주소 없음'
    marker.bindPopup(`<strong>${title}</strong><br>${addr}`)

    // 마커를 레이어 그룹에 추가
    marker.addTo(markerLayer)
  })

  // 마커 수에 따른 화면 조정
  if (coords.length >= 2) {
    // 2개 이상이면 모든 마커가 보이도록 범위에 맞춤 (패딩 포함)
    const bounds = L.latLngBounds(coords)
    map.fitBounds(bounds, { padding: [50, 50] })
  } else if (coords.length === 1) {
    // 1개면 해당 위치를 중심으로 확대 (예: 줌 레벨 14)
    map.setView(coords[0], 14)
  } else {
    // 0개면 기본 서울시청 중심 유지
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
  }
}

onMounted(() => {
  // 컴포넌트가 마운트될 때 지도 객체가 없으면 한 번만 생성
  if (!map && mapElement.value) {
    map = L.map(mapElement.value).setView(DEFAULT_CENTER, DEFAULT_ZOOM)

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // 초기 마커 생성 (props.items가 이미 있으면 적용)
    createMarkers()
  }
})

// items가 바뀌면(깊은 변경 포함) 마커를 다시 생성하고 화면 조정
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
    markerLayer = null
  }
})
</script>

<template>
  <!-- 지도가 그려질 영역: 높이는 500px로 고정 -->
  <div class="attraction-map" ref="mapElement"></div>
</template>

<style scoped>
.attraction-map {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

@media (max-width: 640px) {
  .attraction-map {
    height: 380px;
    border-radius: 12px;
  }
}
</style>