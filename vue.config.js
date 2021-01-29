module.exports={
    // dev:{
    //     proxyTable: {
    //         '/api': {                       //需要代理的接口
    //             target:'http://www.jibei66.com:3000', //目标服务器
    //             changeOrigin: true,　　　　　　 //是否跨域
    //             pathRewrite: {
    //                 '^/api': ''             //重定向
    //             }
    //         }
    //     },
    // }
    devServer: {
        proxy: {
            '/api': {
                target:'http://www.jibei66.com:3000', 
                changeOrigin: true,　　　　　　 
                pathRewrite: {
                    '^/api': ''             
                }
            }
        }
      }
}