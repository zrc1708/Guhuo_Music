import { createRouter, createWebHashHistory,createWebHistory, RouteRecordRaw } from 'vue-router'

import explorMusic from '../views/explorMusic.vue'
import recommendMusic from '../views/recommendMusic.vue'
// import songlist from '../views/songlist.vue'
// import songSheetDetail from '../views/songSheetDetail.vue'
// import dailyRecommend from '../views/dailyRecommend.vue'
// import searchMusic from '../views/searchMusic.vue'

const songlist = () => import(/* webpackChunkName: "group-one" */ '../views/songlist.vue')
const dailyRecommend = () => import(/* webpackChunkName: "group-two" */ '../views/dailyRecommend.vue')
const searchMusic = () => import(/* webpackChunkName: "group-two" */ '../views/searchMusic.vue')
const songSheetDetail = () => import(/* webpackChunkName: "group-two" */ '../views/songSheetDetail.vue')

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
  },
  {
    path: '/songsheetdetail',
    component:songSheetDetail,
  },
  {
    path: '/dailyRecommend',
    component:dailyRecommend,
  },
  {
    path: '/searchmusic',
    component:searchMusic,
  }
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
