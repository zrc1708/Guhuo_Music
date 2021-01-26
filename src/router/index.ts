import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
  history: createWebHashHistory(),
  routes
})

export default router
