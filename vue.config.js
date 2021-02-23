const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports={
    configureWebpack:{
        plugins: [
            new MomentLocalesPlugin({
                localesToKeep: ['zh-cn'],
            }),
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target:'http://127.0.0.1:3000', 
                changeOrigin: true,　　　　　　 
                pathRewrite: {
                    '^/api': ''             
                }
            }
        }
    },
    publicPath: "/",//history模式下publicPath: "/",hash模式下publicPath: "./"
}