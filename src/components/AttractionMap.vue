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

// Leaflet 지도 객체를 저장할 변수
let map = null

// 마커들을 담을 레이어 그룹
let markerLayer = null

// 기본 서울 중심 좌표와 기본 줌
const DEFAULT_CENTER = [37.5665, 126.978]
const DEFAULT_ZOOM = 12

// 서울 좌표 범위
const SEOUL_BOUNDS = {
  minLat: 37.4,
  maxLat: 37.72,
  minLng: 126.75,
  maxLng: 127.2,
}

// 관광지 배열에서 유효한 서울 좌표만 추출해 마커 생성
const createMarkers = () => {
  // 지도가 생성되지 않았으면 아무것도 하지 않음
  if (!map) return

  // 기존 마커 레이어가 있으면 초기화
  if (markerLayer) {
    markerLayer.clearLayers()
  } else {
    markerLayer = L.layerGroup().addTo(map)
  }

  const validItems = props.items
    .map((item) => {
      let lat = Number(item.mapy) // 위도
      let lng = Number(item.mapx) // 경도

      // 숫자가 아니거나 유한하지 않은 좌표 제외
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.warn('숫자가 아닌 좌표 제외:', {
          title: item.title,
          mapy: item.mapy,
          mapx: item.mapx,
        })

        return null
      }

      /*
       * 일부 데이터에서 위도와 경도가 뒤바뀐 경우 보정
       *
       * 정상적인 서울 좌표:
       * 위도 약 37.x
       * 경도 약 126.x 또는 127.x
       */
      const appearsSwapped =
        lat >= 126 &&
        lat <= 128 &&
        lng >= 37 &&
        lng <= 38

      if (appearsSwapped) {
        ;[lat, lng] = [lng, lat]
      }

      // 서울 범위 안에 있는 좌표인지 확인
      const isInSeoul =
        lat >= SEOUL_BOUNDS.minLat &&
        lat <= SEOUL_BOUNDS.maxLat &&
        lng >= SEOUL_BOUNDS.minLng &&
        lng <= SEOUL_BOUNDS.maxLng

      // 서울에서 크게 벗어난 좌표 제외
      if (!isInSeoul) {
        console.warn('서울 범위를 벗어난 좌표 제외:', {
          title: item.title,
          mapy: item.mapy,
          mapx: item.mapx,
          convertedLat: lat,
          convertedLng: lng,
          addr1: item.addr1,
        })

        return null
      }

      return {
        ...item,
        lat,
        lng,
      }
    })
    .filter((item) => item !== null)

  // 마커 좌표 수집
  const coords = []

  validItems.forEach((item) => {
    // Leaflet은 [위도, 경도] 순서 사용
    const latlng = L.latLng(item.lat, item.lng)
    coords.push(latlng)

    // 마커 생성
    const marker = L.marker(latlng)

    // 팝업 내용
    const title = item.title || '이름 없음'
    const addr = item.addr1 || '주소 없음'

    marker.bindPopup(`<strong>${title}</strong><br>${addr}`)

    // 마커를 레이어 그룹에 추가
    marker.addTo(markerLayer)
  })

  // 마커 수에 따라 지도 화면 조정
  if (coords.length >= 2) {
    const bounds = L.latLngBounds(coords)

    map.fitBounds(bounds, {
      padding: [50, 50],
    })
  } else if (coords.length === 1) {
    map.setView(coords[0], 14)
  } else {
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
  }
}

onMounted(() => {
  // 컴포넌트가 마운트될 때 지도 객체를 한 번만 생성
  if (!map && mapElement.value) {
    map = L.map(mapElement.value).setView(
      DEFAULT_CENTER,
      DEFAULT_ZOOM
    )

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map)

    // 초기 마커 생성
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
  // 컴포넌트 제거 시 지도 객체도 정리
  if (map) {
    map.remove()
    map = null
    markerLayer = null
  }
})
</script>

<template>
  <div
    ref="mapElement"
    class="attraction-map"
  ></div>
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