<template>
    <div id="editTeacherOut">
        <h3 style="color:#8BA4FF">信息编辑</h3>
        <button @click="close" style="width:10%;height:25px;background-color:#FF7171;position:absolute;right:20px;top:5px;border-radius:20px"></button>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;margin-left:15%">账号</h4>
        <h4 style="float:left;;width:20%;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center">{{teacherNumber}}</h4>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;clear:both;margin-left:15%">姓名</h4>
        <input id="name" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" :value="teacherName">
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px">编号</h4>
        <h4 id="number" style="float:left;;width:20%;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center">{{teacherId}}</h4>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;clear:both;margin-left:15%">学校</h4>
        <button id="schoolButton" @click="openSchool" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" value="">{{schoolName}}</button>
        <h4 style="float:left;color:#8BA4FF;width:10%;letter-spacing:5px;clear:both;margin-left:15%">登录密码</h4>
        <input id="password" style="float:left;;width:auto;letter-spacing:5px;padding:5px;background: #FFFFFF;box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);border-radius: 15px;text-align:center;outline:none;border:none;height:30px;margin-top:13px;font-size:100%;color:#8BA4FF;font-weight:bold" :value="teacherPassword">
        <button style="position:absolute;width:20%;height:10%;background-color:#8BA4FF;color:white;font-weight:bold;left:40%;bottom:5%;font-size:100%;border-radius:20px" @click="save">保存修改</button>
        <schoolItemList v-for="(item,index) in schoolList" :key="index" style="top:0;left:0" @choseSchool="choseSchool"></schoolItemList>
    </div>
</template>
<style scoped>
#editTeacherOut{
    position: absolute;
    width:60vw;
    height:60vh;
    left:20vw;
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
    name:"editTeacher",
    data(){
        return {
            schoolList:[],
            schoolId:this.schoolIdInter,
            schoolName:this.schoolNameInter
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
        teacherPassword:{
            type:String,
            default:""
        },
        teacherName:{
            type:String,
            default:""
        },
        teacherNumber:{
            type:Number,
            default:0
        },
        teacherId:{
            type:Number,
            default:0
        }
    },
    mounted(){
        setTimeout(()=>{
            document.getElementById("editTeacherOut").style.top="23vh"
        },100)
    },
    components:{
        schoolItemList
    },
    methods:{
        close:function(e){
            document.getElementById("editTeacherOut").style.top="150vh"
            setTimeout(()=>{
            this.$emit("closeEditTeacher")
            },500)
        },
        save:function(e){
            let name=document.getElementById("name").value
            
            let password=document.getElementById("password").value
            let schoolid=this.schoolId
            if(name && number && password && schoolid){
                let path="/api_back/back/setTeacherInfo?username="+this.teacherNumber
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
            http.send(JSON.stringify({name:name,password:password,schoolid:schoolid}))
                
            }else{
                alert("请填写完整信息")
            }
        },
        openSchool:function(){
            let ofss_left=document.getElementById("schoolButton").offsetLeft
            let ofss_top=document.getElementById("schoolButton").offsetTop
            let hei=document.getElementById("schoolButton").offsetHeight
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
