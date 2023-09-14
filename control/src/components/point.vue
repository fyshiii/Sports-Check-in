<template>
    <div id="pointOutFrame">
        <div style="width:100%;height:100%;position:relative">
    <div id="pointOut">
        <div style="width:100%;height:100%;margin:0;padding:0;position:absolute;z-index:90" id="map" >
            <iframe id="mapPage" width="100%" height="100%" style="position:absolute;width:100%;height:100%;left:0" frameborder=0 
            src="https://apis.map.qq.com/tools/locpicker?search=0&type=1&key=3UXBZ-UHEWX-AAL42-ZT73G-PHSET-ZMFON&referer=irun_control">
            </iframe>
        </div>
    </div>
    <div id="zhe" style="transform:scale(0);transition:.5s" @click="unlock">
            <h2 style="position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);font-size:200%;letter-spacing:10px;font-weight:bold;color:rgba(150,150,150,0.9);transition:.3s;">{{locName}}</h2>
            <h2 style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:180%;letter-spacing:10px;font-weight:bold;color:rgba(150,150,150,0.9);transition:.3s">{{lat + ' - ' + lon}}</h2>
            <button style="z-index:100;width:200px;height:30px;position:absolute;top:65vh;left:50%;transform:translateX(-50%);background-color:#8BA4FF;color:white;font-weight:bold;border-radius:15px" @click="chose">确认选点</button>
        <button style="z-index:100;width:100px;height:30px;position:absolute;top:65vh;left:calc(50% + 200px);;transform:translateX(-50%);right:0;;background-color:white;color:#8BA4FF;font-weight:bold;border-radius:15px" @click="reChose">重选</button>
        </div>
        </div>
    </div>
</template>
<style scoped>
#pointOutFrame{
    position: absolute;
    top:150vh;
    left:10vw;
    z-index: 9999;
    height:80vh;
    transition: .3s;
    overflow: hidden;
    width:80vw;
    box-shadow: -5px 5px 15px rgba(150,150,150,0.8);
    border-radius:30px;
    background-color: white;
}
#pointOut{
    position:relative;
    overflow: hidden;
    width:100%;
    height:140%;
    border-radius:30px;
    background-color: white;
}
#zhe{
    position: absolute;
    z-index: 99999;
    width:100%;
    height:90vh;
    background-color:rgba(230,230,230,0.7);
    backdrop-filter: blur(5px);
    top:0;
    left:0
}
</style>
<script>

export default{
    name:"Point",
    data(){
        return{
            hasChose:true,
            lat:0,
            lon:0,
            locName:"",
            loctitle:"",
            schoolId:""
        }
    },
    props:{
        school:{
            type:Number,
            default:0
        }
    },
    mounted(){
        setTimeout(()=>{
            document.getElementById("pointOutFrame").style.top="10vh"
            this.schoolId=this.school
        },100)
        let _this=this
        window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log('location', loc);
          let lat=loc.latlng.lat*1
          lat=lat.toFixed(3)
          let lon=loc.latlng.lng*1
            lon=lon.toFixed(3)
          _this.lat=loc.latlng.lat.toFixed(6)
          _this.lon=loc.latlng.lng.toFixed(6)
          _this.loctitle=loc.cityname
          _this.locName=loc.poiaddress
          _this.lock(null)
          
        }
    }, false);
    },
    methods:{
        chose:function(e){
            e.stopPropagation()
            if(this.hasChose){
                this.$emit("insertPoint",{loc:this.lat+","+this.lon,title:this.loctitle,addr:this.locName})
                this.$emit("close")
            }else{
                console.log("未选点")
            }
        },
        reChose:function(e){
            e.preventDefault()
            console.log(e,"move")
        },
        lock:function(e){
            console.log("hello")
            document.getElementById("zhe").style.transform="scale(1)"
            this.hasChose=true
        },
        unlock:function(){
            document.getElementById("zhe").style.transform="scale(0)"
            this.hasChose=false
        },
    }
}
</script>
