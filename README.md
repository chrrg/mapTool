# mapTool
纯JS 获取百度地图各个数据

# 使用方法
注册百度开发者账号  
创建应用 选浏览器端  
申请到ak  
网页引入mapTool.js文件  
插入以下js代码即可演示获取交通路况数据  


```js
mapTool.init("百度地图申请的ak",function(){
    mapTool.getTrafficData(116.512196,39.999305,function(result){//获取交通路况数据 拥塞程度
        //北京的一条公路
        if(!result){console.log("网络异常！");return;}
        if(result.error){console.log("错误码："+result.error+"\n错误原因：请求太快或输入有误");return;}
        //result.content.tf有多个说明这个经纬度范围有多条路 选一条路判断即可
        console.log("拥堵情况："+result.content.tf[0][3]+" 4不堵 9中度拥堵 14为非常堵")
        
    })
    mapTool.getTrafficData(95.186944,41.722782,function(result){
        //非常偏僻的公路经纬度
        if(!result){console.log("网络异常！");return;}
        if(!result.content){console.log("错误码："+result.error+"\n错误原因：请求太快或输入有误");return;}
        //result.content.tf有多个说明这个经纬度范围有多条路
        console.log("拥堵情况："+result.content.tf[0][3]+" 4不堵 9中度拥堵 14为非常堵")
    })
})
```
# 功能列表
## getTrafficData
获取交通路况信息(经度,纬度,成功回调函数)  


# 更多功能
欢迎PR  
有问题issue  

# 项目技术点
使用ES6的Proxy对百度地图对象进行拦截
使用异步任务队列进行任务管理，顺序执行互不冲突 超时默认5000ms
