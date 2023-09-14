<template>
    <div id="studentControlOut">
        <div id="searchAreaStudent" style="position:relative;height:auto;z-index:999" >
            <h3 style="float:left;margin-left:30px" class="titleButton" v-if="isControler">学校</h3>
            <div class="selectDiv" id="schoolListA" @click="openSchool" v-if="isControler" style="float:left;margin-left:30px;width:20%;font-size:120%;height:100%;margin-top:0%;font-weight:bold">{{schoolName}}</div>
            <h3 style="float:left;margin-left:30px;letter-spacing:5px" class="titleButton">学生编号</h3>
            <input class="selectDiv" id="selectTarget" style="text-align:center;outline:none;float:left;margin-left:30px;width:20%;font-size:120%;height:100%;margin-top:0%;font-weight:bold;border:none">
            <button style="float:left;margin-left:30px;letter-spacing:5px;font-weight:bold;font-size:120%" class="titleButton" @click="select">查询</button>
            <h4 style="clear:both"></h4>
            <schoolItemList v-for="(item,index) in schoolList" :key="index" style="top:0;left:0" @choseSchool="choseSchool" ></schoolItemList>
        </div>
        <Student v-for="(item,index) in showStudent" :key="index" @studentData="openStudentData"  style="top:55vh;width:100%;height:75vh;position:relative;transform:translateY(-75%)" :studentList="studentList_show"></Student>
        <studentData v-for="(item,index) in studentDataList" :studentId="studentId" :key="index" @closeStudenData="closeStudenData" style="left:10%;top:10%"></studentData>
        
    </div>
</template>
<style scoped>
#studentControlOut{
    overflow: hidden;
    width:80%;
    height:95vh;
    margin-left:2%;
    margin-top:30px;
    border-radius:30px;
    background-color: white;
}
.selectDiv{
    padding: 10px;
    background: #FFFFFF;
    box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
}
.titleButton{
    background-color: #8BA4FF;
    padding: 10px;
    color: white;
    letter-spacing: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin:0;
    border-radius: 20px;
}
</style>
<script>
import  Student from "./student.vue"
import studentData from "./studentData.vue"
import DataStore from "./data.js"
import schoolItemList from "./choseSchool.vue"
export default{
    name:"studentControl",
    components:{
        Student,
        studentData,
        schoolItemList
    },
    data(){
        return{
            schoolId:123,
            showStudent:[],
            studentList:[],
            studentList_show:[],
            studentId:"",
            studentDataList:[],
            
            isControler:this.isControl,
            schoolList:[],
            schoolId:10001,
            schoolName:"东华大学松江校区",
        }
    },
    props:{
        isControl:{
            type:Boolean,
            default:false
        }
    },
    created(){
        this.schoolId=DataStore.getScoolId()
        this.getStudentList()
        setTimeout(()=>{
            document.getElementById("close").style.display="none"
            document.getElementById("studentListOut").style.transform="translateY(-60%)"
            
        },500)
    },
    methods:{
        getStudentList:function(){
            let http=new XMLHttpRequest()
            let _this=this
            let path=""
            if(this.isControl){//查全校
            let schoolId=this.schoolId
            console.log("查全校")
            //根据学校id查找所有学生
            path="/api_back/back/getStudentList?type=0&schoolId="+schoolId
                    /*this.studentList=[{
                    "name":"学生",//学生名字
                    "number":1234588,//学号
                    "pass":"1235",
                    "schoolId":10001,
                    "schoolName":"东华大学松江校区",
                    "times":15,
                    "openid":"ajsdkajskdaja",
                    "status":false,//是否合格
                    lock:false
                    }]*/ 
            }else{//查班级
            //根据教师查找其管理下的所有学生信息
            let userName=DataStore.getUserId().name
            console.log(userName)
            path="/api_back/back/getStudentList?type=1&username="+userName
                    /*this.studentList=[{
                    "name":"学生",//学生名字
                    "number":12345,//学号
                                   "pass":"1235",
                    "schoolId":10001,
                    "schoolName":"东华大学松江校区",
                    "times":15,
                    "openid":"ajsdkajskdaja45782",
                    "status":false,//是否合格
                    lock:false
                    }]*/
            }
            console.log("path",path)
            http.open("GET",path) 
            http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.studentList=JSON.parse(http.responseText)
                                _this.studentList_show=_this.studentList
                                _this.showStudent=[1]
                                
                                console.log(_this.studentList)
                            }}}
            http.send()
            
        },
        openStudentData:function(id){
             this.studentId=id
             this.studentDataList=[1]
         },
        closeStudenData:function(){
            this.studentDataList=[]
        },
        openSchool:function(){
            let ofss_left=document.getElementById("schoolListA").offsetLeft
            let ofss_top=document.getElementById("schoolListA").offsetTop
            let hei=document.getElementById("schoolListA").offsetHeight
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
            this.getStudentList()
        },
        closeSchool:function(){
            this.schoolList=[]
        },
        select:function(e){
                let target=document.getElementById("selectTarget").value
                this.showStudent=[]
                console.log("查找",target)
                if(target==""){
                    this.studentList_show=this.studentList
                    
                }else{
                try{
                        this.studentList_show=[]
                        console.log(this.studentList)
                        this.studentList.forEach(ele => {
                            if (ele.number==target){
                                this.studentList_show.push(ele)
                                return
                            }
                        })

                        
                }catch(e){
                    alert("信息有误")
                }
                }
                                        console.log(this.studentList_show)
                        setTimeout(()=>{
                            this.showStudent=[1]
                            setTimeout(()=>{document.getElementById("close").style.display="none"},500)
                            
                        },500)
                
                

            },
    }
}
</script>
