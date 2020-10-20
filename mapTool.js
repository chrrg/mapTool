window.mapTool=(function(){
    if(!Proxy)throw "不支持Proxy用不了！"
    var data={
        isLoad:false,
        queue:[],
        queueStatus:0,
        taskFinishFn:null
    }
    var taskRun=function(){
        if(data.queue.length==0)return
        data.queueStatus=1
        var task=data.queue.splice(0,1)[0]//正在运行的任务
        var timeOutTimer;
        timeOutTimer=setTimeout(function(){
            if(data.queue.length==0)data.queueStatus=0
            setTimeout(function(){task[1]()})//失败
            data.taskFinishFn=null
            taskRun()
        },5000);//超时时间
        data.taskFinishFn=function(result){
            if(data.queue.length==0)data.queueStatus=0
            clearTimeout(timeOutTimer)
            setTimeout(function(){task[1](result)})
            taskRun()
        }
        task[0]()//运行任务
    }
    var addTask=function(taskFn,finishFn){
        data.queue.push([taskFn,finishFn])
        if(data.queueStatus==0)taskRun()
    }
    return {
        getData:function(){return data},
        init:function(ak,fn){
            data.ak=ak
            if(typeof BMapGL==="undefined")
                +function(){
                    var  s=document.createElement("script");
                    s.setAttribute("type","text/javascript");
                    s.setAttribute("src","http://api.map.baidu.com/getscript?type=webgl&v=1.0&ak="+ak+"&services=&t=");
                    s.onload = function(){
                        data.map = new BMapGL.Map(document.createElement("div"));
                        // data.map.addEventListener('tilesloaded', function () {
                        //     if(!data.isLoad){fn();data.isLoad=true}
                        // });
                        data.map.centerAndZoom(new BMapGL.Point(0,0), 20);
                        BMapGL = new Proxy(BMapGL, {
                          get: function(target, key, receiver) {
                            if(key.startsWith("cbkBMAP_CUSTOM_LAYER_")){
                                return function(result){
                                    data.taskFinishFn&&data.taskFinishFn(result)
                                    data.taskFinishFn=null
                                }
                            }
                            return Reflect.get(target, key, receiver);
                          }
                        });
                        fn()
                    }
                    document.body.appendChild(s);
                }();
        },
        getTrafficData:function(lng,lat,fn){
            if(!data.map)throw "请先设置ak"
            addTask(function(){
                data.map.setTrafficOff();//交通打开
                data.map.centerAndZoom(new BMapGL.Point(lng, lat), 20);
                data.map.setTrafficOn();//交通打开
            },fn)
        }
    }
})()
