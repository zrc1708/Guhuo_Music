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
                target:'http://www.jibei66.com:3000', 
                changeOrigin: true,　　　　　　 
                pathRewrite: {
                    '^/api': ''             
                }
            }
        }
      }
}