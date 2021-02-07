import { createStore } from 'vuex'
import request from '../../utils/http'
import moment from 'moment'

export default createStore({
  state: {
    userAccount:'',
    musicUrl:null,
    musicObj:null,
    musicLrc:null,
    isPlay:false,
    myAudio:null,
    playList:[]
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
    },
    setIsPlay(state, val){
      state.isPlay = val
    },
    setMyAudio(state, val){
      state.myAudio = val
    },
    addPlayList(state, val){
      state.playList = val.concat(state.playList)
    },
    setPlayList(state, val){
      state.playList = val
    }
  },
  actions: {
    // 播放音乐（会将歌曲添加进播放列表）
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
      context.commit('addPlayList',[res3.songs[0]])
    },
    // 播放音乐（播放列表中使用，不会添加进播放列表）
    async playMusicInList(context,musicId){
      const res1: any = await request(`/song/url?id=${musicId}`)
      const res3: any = await request(`/song/detail?ids=${musicId}`)
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
