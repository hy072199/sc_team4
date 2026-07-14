// src/composables/useRegionData.js
import tourism from '@/data/서울/서울_관광지.json'
import leisure from '@/data/서울/서울_레포츠.json'
import culture from '@/data/서울/서울_문화시설.json'
import shopping from '@/data/서울/서울_쇼핑.json'
import lodging from '@/data/서울/서울_숙박.json'
import courses from '@/data/서울/서울_여행코스.json'
import festivals from '@/data/서울/서울_축제공연행사.json'

const CATEGORY_MAP = {
  tourism,
  leisure,
  culture,
  shopping,
  lodging,
  courses,
  festivals,
}

export function useRegionData() {
  // 카테고리의 실제 항목 배열만 반환
  const getByCategory = (category) => CATEGORY_MAP[category]?.items ?? []

  // 카테고리 메타 정보(total, contentType 등)까지 필요할 때
  const getCategoryMeta = (category) => {
    const data = CATEGORY_MAP[category]
    if (!data) return null
    const { items, ...meta } = data
    return meta
  }

  // 전체 카테고리 항목을 하나로 합침
  const getAll = () => {
    return Object.values(CATEGORY_MAP).flatMap(data => data.items ?? [])
  }

  // 챗봇 질의응답용 키워드 검색
  const searchByKeyword = (keyword) => {
    return getAll().filter(item =>
      JSON.stringify(item).includes(keyword)
    )
  }

  return { getByCategory, getCategoryMeta, getAll, searchByKeyword }
}