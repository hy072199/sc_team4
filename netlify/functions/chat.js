export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST 요청만 허용됩니다.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { message, context } = await req.json()

  const contextText = buildContextText(context)

  const systemPrompt = `너는 서울 지역 정보 안내 챗봇이야. 아래 [데이터]는 네가 답변할 때 반드시 참고해야 하는 실제 정보야. 이 데이터 안에 있는 내용은 적극적으로 활용해서 구체적으로 답변해. 데이터에 명시적으로 없는 세부 정보(운영시간, 가격 등)를 물어볼 때만 "제공된 정보에는 없어요"라고 답해.

커뮤니티 게시글을 언급할 때는 "제목:", "본문 요약:" 같은 라벨 없이, 실제 이용자 후기를 자연스럽게 소개하듯이 말해줘.

[데이터]
${contextText}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      reasoning_effort: 'medium',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return new Response(JSON.stringify({ error: data.error?.message || '알 수 없는 오류' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildContextText(context) {
  if (!context) return '(참고할 데이터 없음)'

  const { dataMatches = [], postMatches = [], totalCounts = [] } = context

  const countText = totalCounts.length
    ? totalCounts.map(c => `- ${c.category}: 총 ${c.count}건`).join('\n')
    : '(카테고리 정보 없음)'

  const dataText = dataMatches.length
    ? dataMatches.map(d => `- ${d.title} (${d.addr})`).join('\n')
    : '(관련 관광 정보 없음)'

  const postText = postMatches.length
    ? postMatches.map(p => `- ${p.title}: ${p.content || '(내용 없음)'}`).join('\n')
    : '(관련 게시글 없음)'

  return `[카테고리별 전체 건수]\n${countText}\n\n[샘플 장소 목록]\n${dataText}\n\n[커뮤니티 게시글 후기]\n${postText}`
}