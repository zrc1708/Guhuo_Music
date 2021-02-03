import { createRouter, createWebHashHistory,createWebHistory, RouteRecordRaw } from 'vue-router'

import explorMusic from '../views/explorMusic.vue'
import recommendMusic from '../views/recommendMusic.vue'
import songlist from '../views/songlist.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect:'/explormusic'
  },
  {
    path: '/explormusic',
    component:explorMusic,
    redirect:'/explormusic/recommendmusic',
    children:[
      {path:'/explormusic/recommendmusic',component:recommendMusic},
      {path:'/explormusic/songlist',component:songlist}
    ]
  }
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
