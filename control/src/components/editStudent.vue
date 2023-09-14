<template>
    <div id="editStudentOut">
        <h3 style="color:#8BA4FF">信息编辑</h3>
        <button @click="close" style="width:10%;height:25px;background-color:#FF7171;position:absolute;right:20px;top:5px;border-radius:20px"></button>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;margin-left:15%">账号</h4>
        <h4 style="float:left;;width:20%;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center">{{studentId}}</h4>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;clear:both;margin-left:15%">姓名</h4>
        <input id="nameStudent" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" :value="studentName">
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px">学号</h4>
        <h4 style="float:left;;width:20%;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center">{{studentNumber}}</h4>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;clear:both;margin-left:15%">学校</h4>
        <button id="schoolButtonStudent" @click="openSchool" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" >{{schoolName}}</button>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;margin-left:0%">班级</h4>
        <input id="classStudent" style="float:left;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" :value="studentClass">
        <!--h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;clear:both;margin-left:15%">登录密码</h4>
        <input id="passStudent" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" :value="studentPassword"-->
        <button style="position:absolute;width:20%;height:10%;background-color:#8BA4FF;color:white;font-weight:bold;left:40%;bottom:5%;font-size:100%;border-radius:20px" @click="save">保存修改</button>
        <schoolItemList v-for="(item,index) in schoolList" :key="index" style="top:0;left:0" @choseSchool="choseSchool"></schoolItemList>
    </div>
</template>
<style scoped>
#editStudentOut{
    position: absolute;
    width:80%;
    overflow: hidden;
    height:80%;
    left:10%;
    top:150vh;
    background-color: rgba(255,255,255,.75);
    z-index: 1099;
    transition: .3s ease-in-out;
    border-radius: 30px;
    backdrop-filter: blur(15px);
    box-shadow: -5px 5px 10px rgba(150,150,150,0.8);
}
</style>
<script>
import schoolItemList from "./choseSchool.vue"
export default{
    name:"editStudent",
    mounted(){
        setTimeout(()=>{
            document.getElementById("editStudentOut").style.top="10%"
        },100)
    },
    data(){
        return {
            schoolList:[],
            schoolId:this.schoolIdInter,
            schoolName:this.schoolNameInter,
            
        }
    },
    props:{
        schoolIdInter:{
            type:Number,
            default:0
        },
        schoolNameInter:{
            type:String,
            default:""
        },
        studentPassword:{
            type:String,
            default:""
        },
        studentName:{
            type:String,
            default:""
        },
        studentNumber:{
            type:Number,
            default:0
        },
        studentId:{
            type:Number,
            default:0
        },
        studentClass:{
            type:String,
            default:""
        },openid:{
            type:String,
            default:""
        }
    },
    components:{
        schoolItemList
    },
    methods:{
        close:function(e){
            document.getElementById("editStudentOut").style.top="150vh"
            setTimeout(()=>{
            this.$emit("closeEditStudent")
            },500)
        },
        save:function(e){
            let name=document.getElementById("nameStudent").value
            let className=document.getElementById("classStudent").value
            //let password=document.getElementById("passStudent").value
            let schoolid=this.schoolId
            if(name && schoolid && className){
            let path="/api_back/back/setStudentInfo?openid="+this.openid
            let _this=this    
            let http=new XMLHttpRequest()
            http.open("POST",path) 
            http.onreadystatechange=()=>{
            if(http.status==200 && http.readyState==4){
                if(http.responseText!="error"){
                    alert("更改成功")
                    setTimeout(()=>{
                    _this.close()
                    },500)
                }}}
            http.send(JSON.stringify({name:name,class:className,schoolid:schoolid}))
                
                
            }else{
                alert("请填写完整信息")
            }
        },
        openSchool:function(){
            let ofss_left=document.getElementById("schoolButtonStudent").offsetLeft
            let ofss_top=document.getElementById("schoolButtonStudent").offsetTop
            let hei=document.getElementById("schoolButtonStudent").offsetHeight
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
            this.closeSchool()
        },
        closeSchool:function(){
            this.schoolList=[]
        }
    }
}
</script>
