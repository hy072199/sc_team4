// src/composables/useBoardStorage.js

const STORAGE_PREFIX = 'posts_'

/**
 * 게시판 저장소 관리
 * 글 저장, 읽기, 수정, 삭제 등의 기능을 제공합니다
 */
export function useBoardStorage() {
  
  // 1️⃣ 글 작성하기
  const addPost = (category, title, content, password) => {
    // localStorage에서 이 카테고리의 기존 글들을 불러옴
    const key = STORAGE_PREFIX + category
    const data = localStorage.getItem(key)
    const posts = data ? JSON.parse(data) : []
    
    // 새로운 글 객체 만들기
    const post = {
      id: Date.now(),           // 글의 고유 번호 (현재 시간 사용)
      title,                    // 제목
      content,                  // 내용
      password,                 // 비밀번호 (수정/삭제할 때 확인함)
      category,                 // 카테고리 (관광지, 숙박 등)
      createdAt: Date.now(),    // 글 작성한 시간
      updatedAt: Date.now(),    // 글 마지막 수정한 시간
    }
    
    // 글 목록에 새 글 추가
    posts.push(post)
    
    // localStorage에 저장
    localStorage.setItem(key, JSON.stringify(posts))
    
    // 저장된 글 반환
    return post
  }

  // 2️⃣ 글 목록 조회하기
  const getPosts = (category, sortBy = 'recent') => {
    const key = STORAGE_PREFIX + category
    const data = localStorage.getItem(key)
    const posts = data ? JSON.parse(data) : []
    
    // 최신순 또는 오래된순 정렬
    if (sortBy === 'recent') {
      return posts.sort((a, b) => b.updatedAt - a.updatedAt)
    }
    return posts
  }

  // 3️⃣ 특정 글 하나 조회하기
  const getPostById = (category, id) => {
    const posts = getPosts(category)
    return posts.find(post => post.id === Number(id)) || null
  }

  // 4️⃣ 글 수정하기 (비밀번호 확인 필수)
  const updatePost = (category, id, title, content, password) => {
    const key = STORAGE_PREFIX + category
    const data = localStorage.getItem(key)
    const posts = data ? JSON.parse(data) : []
    
    // 수정할 글 찾기
    const postIndex = posts.findIndex(post => post.id === Number(id))
    
    if (postIndex === -1) {
      return { error: '글을 찾을 수 없습니다.' }
    }
    
    // 비밀번호 확인
    if (posts[postIndex].password !== password) {
      return { error: '비밀번호가 일치하지 않습니다.' }
    }
    
    // 글 수정
    posts[postIndex].title = title
    posts[postIndex].content = content
    posts[postIndex].updatedAt = Date.now()
    
    // localStorage에 저장
    localStorage.setItem(key, JSON.stringify(posts))
    
    return posts[postIndex]
  }

  // 5️⃣ 글 삭제하기 (비밀번호 확인 필수)
  const deletePost = (category, id, password) => {
    const key = STORAGE_PREFIX + category
    const data = localStorage.getItem(key)
    const posts = data ? JSON.parse(data) : []
    
    // 삭제할 글 찾기
    const postIndex = posts.findIndex(post => post.id === Number(id))
    
    if (postIndex === -1) {
      return { error: '글을 찾을 수 없습니다.' }
    }
    
    // 비밀번호 확인
    if (posts[postIndex].password !== password) {
      return { error: '비밀번호가 일치하지 않습니다.' }
    }
    
    // 글 배열에서 제거
    posts.splice(postIndex, 1)
    
    // localStorage에 저장
    localStorage.setItem(key, JSON.stringify(posts))
    
    return { success: true }
  }

  // 6️⃣ 글 검색하기 (제목으로)
  const searchPosts = (category, keyword) => {
    const posts = getPosts(category)
    return posts.filter(post =>
      post.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  // 7️⃣ 모든 카테고리의 최근 글 조회하기 (홈화면용)
  const getRecentPosts = (categories, limit = 10) => {
    const allPosts = []
    
    categories.forEach(category => {
      const posts = getPosts(category)
      allPosts.push(...posts)
    })
    
    return allPosts
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit)
  }

  // 모든 함수 반환 (다른 파일에서 쓸 수 있도록)
  return {
    addPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    getRecentPosts,
  }
}