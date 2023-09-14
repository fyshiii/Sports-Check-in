
let proxyObj={}

proxyObj['/back']={
    //websocket
    ws:false,
    open:true,
    target:'http://127.0.0.1:8081',
    //发送请求头host会被设置成target
    changeOrigin:true,
    //不重写请求地址
    pathRewrite:{
        '^/back':'/'
    }
}



module.exports={
    devServer:{
            proxy:"http://127.0.0.1:8081/", //开发环境的跨域问题解决，后端springboot服务ip 和 端口
            port: 8080 //dev模式
    }
}