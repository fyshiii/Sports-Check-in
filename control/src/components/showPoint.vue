<template>
        <div id="showPointOut">
            <button style="height:8vh;width:8vh;border-radius:4vh;position:fixed;bottom:3vh;right:4vw;background-color:white;z-index:9997;background-color:#8BA4FF;color:white;font-size:120%;font-weight:bold" @click="reset">重置</button>
        <div style="width:100%;height:130%;margin:0;;padding:0;position:absolute;z-index:90;margin-top:0%" id="map" >
             <iframe id="mapPage" width="100%" height="100%" style="position:absolute;width:100%;height:100%;left:0" frameborder=0 
           >
            </iframe>
        </div>
         <div id="topOption" >
                <button style="float:left;color:white;width:10%;letter-spacing:5px;clear:both;margin-left:3%;background-color:#8BA4FF;height:80%;margin-top:5px;border-radius:30px;font-size:120%">学校</button>
                <button id="schoolListPoint" @click="openSchool" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;;margin-top:5px;margin-left:1%;font-size:100%;color:#8BA4FF;font-weight:bold">{{schoolName}}</button>
                <div   style="float:left;width:auto;padding-left:10px;padding-right:10px;height:30px;background: #8BA4FF;border-radius: 15px;margin-top:10px;margin-left:15px" v-for="(item,index) in pointList" :key="index">
                    <button @click="showOnePoint" :data-index="index" style="background-color:transparent;color:white;height:100%;width:auto;font-size:120%;float:left">{{'坐标点'+(index+1)}}</button>
                    <button :data-index="index" @click="removePoint" style="background-color:white;color:white;height:15px;width:15px;font-size:120%;float:left;margin-top:8px;border-radius:15px"></button>
                </div>
                <div   style="float:left;width:auto;padding-left:10px;padding-right:10px;height:30px;background: #8BA4FF;border-radius: 15px;margin-top:10px;margin-left:15px">
                    <button @click="add" :data-index="0" style="background-color:transparent;color:white;height:100%;width:auto;font-size:120%;float:left">+</button>
                </div>
                <schoolItemList v-for="(item,index) in schoolList" :key="index" style="top:0;left:0" @choseSchool="choseSchool" ></schoolItemList>
            </div>
        <!--div id="zhe" style="transform:scale(0);transition:.5s" @click="unlock">
            <h2 style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);font-size:200%;letter-spacing:10px;font-weight:bold;color:rgba(150,150,150,0.9);transition:.3s">{{locName}}</h2>
            <h2 style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:180%;letter-spacing:10px;font-weight:bold;color:rgba(150,150,150,0.9);transition:.3s">{{lat + ' - ' + lon}}</h2>
            <button style="z-index:100;width:200px;height:30px;position:absolute;top:65vh;left:50%;transform:translateX(-50%);background-color:#8BA4FF;color:white;font-weight:bold;border-radius:15px" @click="chose">确认选点</button>
            <button style="z-index:100;width:100px;height:30px;position:absolute;top:65vh;left:calc(50% + 200px);;transform:translateX(-50%);right:0;;background-color:white;color:#8BA4FF;font-weight:bold;border-radius:15px" @click="reChose">重选</button>
        </div-->
        <div id="choseBack" style="transform:scale(0);position:absolute;z-index:9998;width:100%;height:100%;background-color:rgba(185,185,185,0.8);backdrop-filter:blur(5px);top:0;left:0;border-radius:50%;">
        <button v-for="(item,index) in showAddPoint" :key="index"   style="width:8%;height:25px;background-color:#FF7171;position:absolute;right:10vw;top:2vh;border-radius:20px;z-index:99999"  @click="close"></button>
        <Point v-for="(item,index) in showAddPoint" :key="index" @insertPoint="insertPoint" :school="schoolId" style="width:80%;height:80vh;left:10%;top:5vh" @close="close">
            
        </Point>
        </div>
        
    </div>
</template>
<style scoped>
#showPointOut{
    position:relative;
    overflow: hidden;
    width:80%;
    height:90vh;
    margin-left:2%;
    margin-top:10px;
    border-radius:30px;
    background-color: white;
}
#topOption{
    position: absolute;
    top:0;
    left:0;
    z-index: 999;
    width:100%;
    height:8%;
    margin-top: 1%;
    border-radius: 30px;
    z-index: 9999;
    background-color: white;
}
</style>
<script>
import Point from "./point.vue"
import DataStore from "./data.js"
import schoolItemList from "./choseSchool.vue"
export default{
    name:"showPoint",
    components:{
        Point,
        schoolItemList
    },
    data(){
        return{
            schoolId:100001,
            showAddPoint:[],
            pointList:[
                
            ],
            showPointList:[],
            apiData:"key=3UXBZ-UHEWX-AAL42-ZT73G-PHSET-ZMFON&referer=irun_control",
            src:'https://apis.map.qq.com/tools/poimarker?type=0&marker=',
            schoolList:[],
            schoolId:10001,
            schoolName:"东华大学松江校区",
        }
    },
    mounted(){
        this.schoolId=DataStore.getScoolId()
        this.showPointList=this.pointList
        this.getSchoolPoint(this.createSrc)
        
    },
    methods:{
    getSchoolPoint:function(callBack){
    let school=this.schoolId
        let data={100001:[]}
        let _this=this
        let http=new XMLHttpRequest()
        http.open("GET","/api_back/back/getPoint?schoolid="+school)
        console.log("path","/api_back/back/getPoint?schoolid="+school)
        http.onreadystatechange=()=>{
            if(http.status==200 && http.readyState==4){
                if(http.responseText!="error"){
                    data=JSON.parse(http.responseText)
                    _this.pointList=data
                    _this.showPointList=_this.pointList
                    callBack()
            }else{
                _this.pointList=data[school]
                _this.showPointList=_this.pointList
            }}}
        http.send()
        
    },
    createSrc:function(){
       let src=this.src
        for(let i=0;i<this.showPointList.length;i++){
            let path='coord:'+this.showPointList[i].coord+';title:'+this.showPointList[i].title+';addr:'+this.showPointList[i].addr
            if(i<this.showPointList.length-1){
                path+="|"
            }
            src+=path
        }
        src+="&"+this.apiData
        console.log(src)
        document.getElementById("mapPage").src=src
    },
    showOnePoint:function(e){
        console.log("hello",e)
        let index=e.target.dataset.index*1
        this.showPointList=[this.pointList[index]]
        this.createSrc()
    },
    reset:function(){
        this.showPointList=this.pointList
        this.createSrc()
    },
    add:function(){
        this.showAddPoint=[1]
        document.getElementById("choseBack").style.borderRadius="0"
        document.getElementById("choseBack").style.transform="scale(1)"
    },
    insertPoint:function(loc){
        let coord=loc.loc
        let school=this.schoolId
        let title=loc.title
        let addr=loc.addr
        let _this=this
        let http=new XMLHttpRequest()
        this.pointList.push({coord:coord,title:title,addr:addr})
        http.open("POST","/api_back/back/setPoint?schoolid="+school)
        http.onreadystatechange=()=>{
            if(http.status==200 && http.readyState==4){
                if(http.responseText!="error"){
                    _this.createSrc()
            }}}
        http.send(JSON.stringify(this.pointList))
        

    },
    close:function(){
            document.getElementById("choseBack").style.borderRadius="50%"
        document.getElementById("choseBack").style.transform="scale(0)"
        setTimeout(()=>{
            this.showAddPoint=[]
        },500)
    },
    removePoint:function(e){
        let school=this.schoolId
        let index=e.target.dataset.index*1
        if(confirm("确认删除坐标点"+(index+1))){
            this.pointList.splice(index,1)
            this.showPointList=this.pointList
            let _this=this
            let http=new XMLHttpRequest()
            http.open("POST","/api_back/back/setPoint?schoolid="+school)
            http.onreadystatechange=()=>{
                if(http.status==200 && http.readyState==4){
                    if(http.responseText!="error"){
                        if(_this.showPointList.length==0){
                            document.getElementById("mapPage").src="https://apis.map.qq.com/tools/geolocation?"+_this.apiData
                            window.addEventListener('message', function(event) {
                                // 接收位置信息
                                var loc = event.data;
                                if(loc){
                                    console.log(loc)
                                    let coord=loc.lat+","+loc.lng
                                    let path="https://apis.map.qq.com/tools/poimarker?marker=coord:"+coord+";title:"+loc.city+";addr:"+loc.city+"&"+_this.apiData
                                    document.getElementById("mapPage").src=path
                                    console.log(path)
                                    alert("删除成功")
                                }
                            }, false);
                        }else{
                            _this.createSrc()
                        }
                }}}
            http.send(JSON.stringify(this.pointList))
        }
    },
    openSchool:function(){
            let ofss_left=document.getElementById("schoolListPoint").offsetLeft
            let ofss_top=document.getElementById("schoolListPoint").offsetTop
            let hei=document.getElementById("schoolListPoint").offsetHeight
            this.schoolList=[1]
            console.log(ofss_left,ofss_top)
            setTimeout(()=>{
            document.getElementById("schoolFrame").style.height="35vh"
            document.getElementById("schoolFrame").style.top=(ofss_top+hei)+"px"
            document.getElementById("schoolFrame").style.left=ofss_left+"px"
            },500)
        },
        choseSchool:function(data){
            this.schoolName=data.name
            this.schoolId=data.id
            console.log("选择",this.schoolName,this.schoolId)
            this.closeSchool()
            this.getSchoolPoint(this.createSrc)
            
        },
        closeSchool:function(){
            this.schoolList=[]
        }
    }

}
//https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:39.96554,116.26719;title:成都;addr:北京市海淀区复兴路32号院|coord:39.87803,116.19025;title:成都园;addr:北京市丰台区射击场路15号北京园博园|coord:39.88129,116.27062;title:老成都;addr:北京市丰台区岳各庄梅市口路西府景园六号楼底商&key=3UXBZ-UHEWX-AAL42-ZT73G-PHSET-ZMFON&referer=irun_control
</script>
