export default async (req) => {
  const { message } = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '너는 서울 지역 정보 안내 챗봇이야.' },
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

export const config = { path: '/api/chat' }