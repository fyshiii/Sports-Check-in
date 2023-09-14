<template>
    <div id="chartMain" style="width:80%;height:auto;margin-left:2%;margin-top:30px;border-radius:30px">
        <div style="width:100%;padding-top:30px;padding-bottom:30px;" id="chartOut">
            <div id="charts" v-if="showChart" style="position:relative;height:300px;width:60%;background-color:white;margin-left:2%;border-radius:20px;float:left">

            </div>
            <div id="charts2" v-if="showChart" style="height:300px;width:35%;background-color:white;margin-left:2%;border-radius:20px;float:left;position:relative;">

            </div>
            </div>
        <div id="record_out">
            <div v-for="(item,index) in operatingRecord" :key="index" style="width:90%;margin-left:5%;margin-top:10px;background-color:white;border:1px solid #8BA4FF;border-radius:10px;position:relative;height:auto;padding-top:3px;padding-bottom:3px;color:#8BA4FF;font-weight:normal;clear:both;margin-bottom:5px">
                <h4 class="operating_item" style="width:5%;">{{index+1}}</h4>
                <h4 class="operating_item" style="width:10%;">{{item.name}}</h4>
                <h4 class="operating_item" style="width:15%;">{{item.number}}</h4>
                <h4 class="operating_item" style="width:15%;">{{item.time}}</h4>
                <h4 class="operating_item" style="width:55%;">{{item.content}}</h4>
                <h4 style="clear:both"></h4>
            </div>
        </div>
    </div>
</template>
<style scoped>
#chartMain{
    background-color: white;
}
.operating_item{
    float:left;margin:0;height:30px;margin-top:10px
}
#chartOut{
    position: relative;
    background-color: #ACC2FC;
    padding-top:30px;
    height: 300px;
    padding-bottom:50px;
    border-radius:30px
}
#record_out{
    border-radius: 30px;
    margin-top:2vh;
    height: 37vh;
    overflow-y: scroll;
    width:100%;
    background-color: white;
}
</style>
<script>
import * as echarts from "echarts"
export default{
    name:"dashBord",
    data(){
        return{
            operatingRecord:[
                
            ],
            showChart:false
        }
    },
    beforeMount(){
        this.showChart=true
    },
    mounted(){
        this.getRecord()
        this.getChart()
    },
    onUnmounted(){

		this.showChart=false
	},
    methods:{
        getRecord:function(){
            let path="/api_back/back/getRecord"
            let _this=this    
            let http=new XMLHttpRequest()
            http.open("GET",path) 
            http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                let data=JSON.parse(http.responseText)
                                _this.operatingRecord=data
                            }}}
            http.send()
        },
        getChart:function(){
            let path="/api_back/back/getChart"
            let _this=this    
            let http=new XMLHttpRequest()
            http.open("GET",path) 
            http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                let data=JSON.parse(http.responseText)
                                try{
                                    _this.playChart(data["date"],data["exData1"],data["exData2"])
                                }catch(e){
                                    console.log("error")
                                }
                            }}}
            http.send()
        },
        playChart:function(date,data1,data2){
        let myChart = echarts.init(document.getElementById("charts"))
        let myChart2 = echarts.init(document.getElementById("charts2"))
        let option = {
                    title : {
                    show:true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
                    text: '跑步打卡人数', //主标题文本，'\n'指定换行
                    x:'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
                    y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
                    textStyle:{
                        fontSize:15,
                        color:"#ACC2FC"
                    }
                },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                        title:"跑步打卡人数",
                        data: data1,
                        type: 'line',
                        areaStyle: {}
                        }
                    ]
                    };
        let option2 = {
                title : {
                    show:true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
                    text: '定点打卡人数', //主标题文本，'\n'指定换行
                    x:'center', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
                    y: 'top', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
                    textStyle:{
                        fontSize:15,
                        color:"#ACC2FC"
                    }
                },
            xAxis: {
                type: 'category',
                data: date
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                data: data2,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
                }
            ]
            };
        myChart.clear();//消除当前实例
        myChart.setOption(option)
        myChart2.clear();
        myChart2.setOption(option2)
        }
    }
}
</script>
