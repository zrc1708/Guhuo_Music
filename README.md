# Guhuo_Music（姑获云音乐）
使用vue3.0+vue-router+vuex编写的仿网易云项目  
本项目实现了大部分和听歌相关的功能  

在本项目，您可以
+ 登录、登出
+ 浏览个性推荐页面
+ 浏览歌单页面
+ 浏览自己创建的歌单
+ 浏览收藏的歌单
+ 搜索歌曲
+ 播放歌曲
+ 查看播放列表
+ 操作进度、播放按钮等
+ 查看同步的歌词
+ 。。。

本项目没有进行需要同步到网易云服务器的操作，登录后不会影响用户网易云上的数据  

前端未使用任何第三方组件，所有组件均为手写。样式，响应等尽力做到还原。

准备了一些效果图，感兴趣的可以前去readmeImage文件夹查看  
也欢迎来[http://music.jibei66.com](http://music.jibei66.com)体验

后端使用[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)，感谢作者的开源

最后的运行须知：
+ 本项目使用反代跨域，如果您需要调整接口地址，请前往vue.config.js
+ 本项目简单封装了一下axios，可以前往utils文件夹的http进行个性化修改