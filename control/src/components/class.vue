<template>
    <div id="classListOut">
        <div style="height:100%;width:100%;overflow-y:scroll">
        <button id="close" @click="close" v-if="role != 'teacher'"></button>
         <div class="classItemClass" v-for="(item,index) in classList" :key="index">
                <h4 class="classItem" style="width:5%;">{{index+1}}</h4>
                <h4 class="classItem" style="width:10%;">{{item.number}}</h4>
                <h4 class="classItem" style="width:15%;">{{item.nums}}</h4>
                <button class="classItem" :data-index="index" style="float:right;margin-right:20px;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white;background-color:#FF7676" @click="delClass">删除</button>
                <button class="classItem" :data-index='index' @click="openStudent" style="float:right;background-color:#8BA4FF;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white">查看</button>            
                </div>
        </div>
        <Student v-for="(item,index) in showStudent" @studentData="openStudentData" :key="index" :studentList="studentList" style="width:76%;left:12%;position:absolute;z-index:100;backdrop-filter:blur(15px)" @close="closeStudent">

        </Student>
        <studentData v-for="(item,index) in studentDataList" :studentId="studentId" :key="index" @closeStudenData="closeStudenData"></studentData>
    </div>
</template>
<style scoped>
#classListOut{
    transition: .2s;
    background: rgba(230, 230, 230, 0.5);
    box-shadow: -2px 4px 15px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    height:75vh;
    margin-top:2vh;
    width:100%;
    position: absolute;
    top: 120vh;
}
.classItemClass{
    width:96%;
    position: relative;
    overflow: hidden;
    margin-top:10px;
    margin-left:2%;
    height:45px;
    background: #FFFFFF;
    border-radius: 15px;
}
.classItemClass:nth-of-type(1){
    margin-top:50px
}
#close{
    position: fixed;
    width: 80px;
    height:30px;
    top:5px;
    border-radius: 20px;
    right:10px;
    z-index: 99;
    background-color: #FF7676;
}
.classItem{
        float:left;margin:0;height:30px;margin-top:10px;
    margin-left:10px;
}
</style>
<script>
import Student from "./student.vue"
import studentData from "./studentData.vue"
import DataStore from "./data.js"
 export default{
     name:"Class",
     props:{
         classList_inter:{
            type:Array,
            default:[]
         },
         userName:{
             type:Number,
             default:null
         },
         role:{
            type:String,
            default:""
         }

     },
     data(){
         return{
            showStudent:[],
            studentList:[],
            studentId:"",
            studentDataList:[],
            classList:this.classList_inter
         }
     },
     watch:{
         classList_inter:{
             handler:function(val){},
             immediate:true,
             deep:true
         }
     },
     components:{
         Student,studentData
     },
     mounted(){
         console.log(this.classList)
         if(this.role=="teacher"){
             let http=new XMLHttpRequest()
            let _this=this
            http.open("POST","/api_back/back/getClass?username="+DataStore.getUserId()["name"])
            http.onreadystatechange=()=>{
                if(http.status==200 && http.readyState==4){
                    if(http.responseText!="error"){
                        _this.classList=JSON.parse(http.responseText)
                    }
                }}
            http.send()
         }
         else if(this.userName==null){//按学校查询
            let path="/api_back/back/getClassList?nn=qs&schoolid="+DataStore.getScoolId()
            let _this=this    
            let http=new XMLHttpRequest()
            http.open("GET",path) 
            http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.classList=JSON.parse(http.responseText)
                            }}}
            http.send()
         }
         setTimeout(()=>{
             document.getElementById("classListOut").style.top="50%"
             document.getElementById("classListOut").style.transform="translateY(-50%)"
         },200)
     },
     methods:{
         close:function(){
             document.getElementById("classListOut").style.top="150vh"
             setTimeout(()=>{
                 this.$emit("close")
             },600)
         },
         openStudent:function(e){
            let index=e.target.dataset.index
            let classNumber=this.classList[index].number
            let path="/api_back/back/getStudentList?type=2&class="+classNumber
            let _this=this    
            let http=new XMLHttpRequest()
            http.open("GET",path) 
            http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.studentList=JSON.parse(http.responseText)
                                _this.showStudent=[1]
                                console.log(_this.studentList)
                            }}}
            http.send()
         },
         closeStudent:function(){
             this.showStudent=[]
         },
         openStudentData:function(id){
             this.studentId=id
             this.studentDataList=[1]
         },
         closeStudenData:function(){
             this.studentDataList=[]
         },
         delClass:function(e){
             let index=e.target.dataset.index*1
             let classNumber=this.classList[index].number
             if(confirm("确认删除班级"+classNumber)){
                 this.classList.splice(index,1)
                 alert("删除成功")
             }
         }
     }

 }
</script>
