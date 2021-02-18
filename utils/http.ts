import axios from 'axios'
// axios.defaults.baseURL = 'http://www.jibei66.com:3000'
// 配合反向代理
axios.defaults.baseURL = '/api'

// 添加响应拦截器
axios.interceptors.response.use( response => {  
    return response;
}, error => {  
    if(error.response.status==404&&error.response.config.url.indexOf('/check/music?id=')==0){
        return error.response
    }
    return Promise.reject(error);
});


type Method = 'get' | 'post' | 'put' | 'delete'

const request = (url, data={}, method: Method ="get")=>{
    return new Promise((resolve,reject)=>{
        axios({
            method:method,
            url:url,
            data
        }).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            console.log('err'+err);
        })
    })
}

export default request