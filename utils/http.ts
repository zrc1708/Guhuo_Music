import axios from 'axios'
// axios.defaults.baseURL = 'http://www.jibei66.com:3000'
// 配合反向代理
axios.defaults.baseURL = '/api'

type Method = 'get' | 'post' | 'put' | 'delete'

const request = (url, data={}, method: Method ="get")=>{
    const cookie = localStorage.getItem('cookie')||''
    return new Promise((resolve,reject)=>{
        axios({
            method:method,
            url:url,
            data
        }).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            console.log(err);
        })
    })
}

export default request