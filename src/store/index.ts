import { createStore } from 'vuex'
import request from '../../utils/http'

export default createStore({
  state: {
    userAccount:'',
    musicUrl:null,
    musicObj:null
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
    }
  },
  actions: {
    async playMusic(context,musicId){
      // 获取歌曲地址
      const res1: any = await request(`/song/url?id=${musicId}`)
      console.log(res1.data[0]);
      // 获取歌曲详情
      const res3: any = await request(`/song/detail?ids=${musicId}`)
      console.log(res3.songs[0]);
      // 获取歌词
      const res2: any = await request(`/lyric?id=${musicId}`)
      console.log(res2.lrc);
      console.log(res2.tlyric);

      context.commit('setMusicUrl',res1.data[0])
      context.commit('setMusicObj',res3.songs[0])
      
    }
  },
  modules: {
  }
})
