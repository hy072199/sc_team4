import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/board/:category',
    name: 'boardList',
    component: () => import('@/views/BoardListView.vue'),
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