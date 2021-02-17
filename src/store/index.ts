import { createStore } from 'vuex'
import request from '../../utils/http'
import moment from 'moment'

const playListSet = new Set()

export default createStore({
  state: {
    userAccount:'',
    musicUrl:null,
    musicObj:null,
    musicLrc:null,
    isPlay:false,
    myAudio:null,
    playList:[],
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
      val.forEach(item => {
        playListSet.add(item.id)
      });
    },
    setPlayList(state, val){
      state.playList = val
      val.forEach(item => {
        playListSet.add(item.id)
      });
    },
    clearPlayList(state,val){
      state.playList = []
      playListSet.clear()
    }
  },
  actions: {
    // 播放音乐
    async playMusic(context,musicId){
      // 获取歌曲地址
      const res1: any = await request(`/song/url?id=${musicId}`)
      // 获取歌词
      const res2: any = await request(`/lyric?id=${musicId}`)
      // 获取歌曲详情
      const res3: any = await request(`/song/detail?ids=${musicId}`)

      res3.songs[0].lastTime = moment(res3.songs[0].dt).format('mm:ss')

      context.commit('setMusicUrl',res1.data[0])
      context.commit('setMusicObj',res3.songs[0])
      context.commit('setMusicLrc',{
        lrc:res2.lrc,
        tlyric:res2.tlyric
      })

      if(!playListSet.has(res3.songs[0].id)){
        context.commit('addPlayList',[res3.songs[0]])
      }
    }
  },
  modules: {
  }
})
