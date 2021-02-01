import { createStore } from 'vuex'
import request from '../../utils/http'
import moment from 'moment'

export default createStore({
  state: {
    userAccount:'',
    musicUrl:null,
    musicObj:null,
    musicLrc:null
  },
  mutations: {
    setUser(state, val){
      state.userAccount = val
    },
    setMusicUrl(state, val){
      state.musicUrl = val
    },
    setMusicObj(state, val){
      state.musicObj = val
    },
    setMusicLrc(state, val){
      state.musicLrc = val
    }
  },
  actions: {
    async playMusic(context,musicId){
      // 获取歌曲地址
      const res1: any = await request(`/song/url?id=${musicId}`)
      // 获取歌曲详情
      const res3: any = await request(`/song/detail?ids=${musicId}`)
      // 获取歌词
      const res2: any = await request(`/lyric?id=${musicId}`)

      res3.songs[0].lastTime = moment(res3.songs[0].dt).format('mm:ss')

      context.commit('setMusicUrl',res1.data[0])
      context.commit('setMusicObj',res3.songs[0])
      context.commit('setMusicLrc',{
        lrc:res2.lrc,
        tlyric:res2.tlyric
      })
    }
  },
  modules: {
  }
})
