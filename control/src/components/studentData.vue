<!--传入学生编号查询该学生运动数据-->
<template>
    <div id="studentDataMain">
        <button id="closeData" @click="close"></button>
        <div class="studentItemClass" v-for="(item,index) in dataList" :key="index">
                <h4 class="studentItem" style="width:5%;margin-top:15px">{{index+1}}</h4>
                <h4 class="studentItem" style="width:10%;">{{item.type==1 ? '定点打卡' :'跑步打卡'}}</h4>
                <h4 class="studentItem" style="width:10%;margin-top:14px">{{item.time}}</h4>
                <h4 class="studentItem" style="width:10%;margin-top:14px" v-if="item.type==0">{{item.dis}}</h4>
                <h4 class="studentItem" style="width:10%;">{{item.status ? '有效' : '无效'}}</h4>
                <button class="studentItem" style="float:right;margin-right:20px;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white;background-color:#FF7676">删除</button>         
        </div>
    </div>
</template>
<style scoped>
#closeData{
    position: absolute;
    width: 80px;
    height:30px;
    top:5px;
    border-radius: 20px;
    right:10px;
    z-index: 99;
    background-color: #FF7676;
}
#studentDataMain{
    position: absolute;
    width:80vw;
    height:85vh;
    transform: scale(0);
    border-radius: 30px;
    top:-5vh;
    left:0;
    transition: .3s;
    z-index: 99999;
    background-color: rgba(250,250,250,0.95);
    box-shadow: -5px 5px 15px rgba(150,150,150,0.8);
}
.studentItemClass{
    width:96%;
    position: relative;
    overflow: hidden;
    margin-top:10px;
    margin-left:2%;
    height:45px;
    background: #FFFFFF;
    border-radius: 15px;
}
.studentItemClass:nth-of-type(1){
    margin-top:50px
}
.studentItem{
    float:left;
    margin:0;
    height:30px;
    margin-top:10px;
    font-size: 18px;
    margin-left:10px;
}
</style>
<script>
export default{
    name:"studentData",
    props:{
        studentId:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            dataList:[]
        }
    },
    created(){
        setTimeout(()=>{
            document.getElementById('studentDataMain').style.transform="scale(1)"
            this.getDataList()
        },100)
    },
    methods:{
        getDataList:function(){
            let openid=this.studentId
            let http=new XMLHttpRequest()
                    let _this=this
                    http.open("POST","/api_back/back/getStudentData?openid="+openid)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.dataList=JSON.parse(http.responseText)
                            }}}
            http.send()
        },
        close:function(){
             document.getElementById("studentDataMain").style.transform="scale(0)"
             setTimeout(()=>{
                 this.$emit("closeStudenData")
             },600)
         }
    }
}
</script>
