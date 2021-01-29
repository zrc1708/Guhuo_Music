import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/normalize.css'
import './assets/css/global.css'

const app = createApp(App)

// import axios from 'axios'
// axios.defaults.baseURL = 'http://www.jibei66.com:3000'
// app.config.globalProperties.$http = axios;

app.use(store).use(router).mount('#app')
