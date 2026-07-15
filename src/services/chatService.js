// src/services/chatService.js
import { useRegionData } from '@/composables/useRegionData'
import { useBoardStorage } from '@/composables/useBoardStorage'

const CATEGORY_KEYWORDS = {
  tourism: ['관광지', '관광', '여행지', '명소'],
  culture: ['문화시설', '문화', '전시', '박물관', '도서관'],
  leisure: ['레포츠', '레저', '스포츠', '액티비티', '운동'],
  shopping: ['쇼핑', '쇼핑몰', '시장', '마켓'],
  lodging: ['숙박', '호텔', '펜션', '게스트하우스'],
  courses: ['여행코스', '코스', '루트', '동선'],
  festivals: ['축제', '공연', '행사', '이벤트'],
}

const AREA_KEYWORDS = [
  '홍대', '강남', '이태원', '명동', '종로', '을지로', '성수', '건대',
  '잠실', '여의도', '신촌', '동대문', '서울숲', '한강',
]

const DISTRICT_KEYWORDS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구',
  '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구',
  '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구',
  '은평구', '종로구', '중구', '중랑구',
]

function detectCategories(message) {
  const matched = []
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => message.includes(kw))) {
      matched.push(category)
    }
  }
  return matched
}

function detectArea(message) {
  const district = DISTRICT_KEYWORDS.find(d => message.includes(d))
  if (district) return district

  const area = AREA_KEYWORDS.find(a => message.includes(a))
  if (area) return area

  return null
}

// 본문이 너무 길면 컨텍스트가 비대해지니, 일정 길이로 잘라서 전달
function truncate(text, maxLength = 150) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function buildContext(message) {
  const { getByCategory } = useRegionData()
  const { searchPosts } = useBoardStorage()

  const categories = detectCategories(message)
  const targetCategories = categories.length > 0 ? categories : ['tourism']
  const area = detectArea(message)

  const dataMatches = []
  targetCategories.forEach(category => {
    let items = getByCategory(category)

    if (area) {
      const filtered = items.filter(item => item.addr1?.includes(area))
      items = filtered.length > 0 ? filtered : items
    }

    dataMatches.push(...items.slice(0, 5).map(item => ({
      title: item.title,
      addr: item.addr1,
    })))
  })

  const postSearchTerm = area || Object.values(CATEGORY_KEYWORDS)
    .find((keywords, i) => targetCategories[0] === Object.keys(CATEGORY_KEYWORDS)[i])?.[0]

  const postMatches = []
  targetCategories.forEach(category => {
    const allPosts = searchPosts(category, '')
    const relevant = postSearchTerm
      ? allPosts.filter(p => p.title.includes(postSearchTerm) || p.content?.includes(postSearchTerm))
      : allPosts
    postMatches.push(...relevant.map(p => ({
      title: p.title,
      content: truncate(p.content), // 본문 요약 추가
      category,
    })))
  })

  return {
    dataMatches: dataMatches.slice(0, 8),
    postMatches: postMatches.slice(0, 3),
    matchedCategories: targetCategories,
    matchedArea: area,
    totalCounts: targetCategories.map(c => ({
      category: c,
      count: getByCategory(c).length,
    })),
  }
}

export async function sendMessage(message) {
  const context = buildContext(message)

  const res = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  })

  if (!res.ok) {
    throw new Error(`요청 실패: ${res.status}`)
  }

  return res.json()
}