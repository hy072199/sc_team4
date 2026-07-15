import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/explore/:category',
    name: 'exploreList',
    component: () => import('@/views/BoardListView.vue'), // 관광 정보 카드+지도+통계
  },
  {
    path: '/board/:category',
    name: 'boardList',
    component: () => import('@/views/PostListView.vue'), // 진짜 커뮤니티 게시판
  },
  {
    path: '/board/:category/write',
    name: 'boardWrite',
    component: () => import('@/views/BoardWriteView.vue'),
  },
  {
    path: '/board/:category/:id/edit',
    name: 'boardEdit',
    component: () => import('@/views/BoardWriteView.vue'),
  },
  {
    path: '/board/:category/:id',
    name: 'boardDetail',
    component: () => import('@/views/BoardDetailView.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})