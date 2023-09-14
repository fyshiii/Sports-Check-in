<template>
    <div id="studentListOut">
        <button id="close" @click="close"></button>
        <div class="studentItemClass" v-for="(item,index) in studentListData" :key="index">
                <h4 class="studentItem" style="width:5%;margin-top:15px">{{index+1}}</h4>
                <h4 class="studentItem" style="width:10%;">{{item.name}}</h4>
                <h4 class="studentItem" style="width:10%;margin-top:14px">{{item.number}}</h4>
                <h4 class="studentItem" style="width:10%;margin-top:14px">{{item.times}}</h4>
                <h4 class="studentItem" style="width:10%;">{{item.status ? '合格' : '不合格'}}</h4>
                <button class="studentItem" :data-index="index" style="float:right;margin-right:20px;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white;background-color:#FF7676" @click="delStudent">删除</button>
                <div class="studentItem" style="float:right;width:60px;border-radius:15px;height:20px;background-color:white;border:1px solid #8BA4FF;transform:translateY(5px)">
                    <button style="transition:.5s;position: absolute;" :data-index="index" :class="[item.lock ? 'locked':'unlocked']" @click="setStatus"></button>
                </div>
                <button class="studentItem" style="float:right;margin-right:20px;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white;background-color:#8BA4FF" :data-index="index" @click="openEditStudent">编辑信息</button>
                <button class="studentItem" style="float:right;background-color:#8BA4FF;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white" :data-index="index" @click="showData">运动数据</button>            
        </div>
        <editStudent v-for="(item,index) in showEditStudent" :key="index" @closeEditStudent="closeEditStudent" :schoolIdInter="schoolId" :schoolNameInter="schoolName" :studentName="studentName" :studentPassword="studentPassword" :studentNumber="studentNumber" :studentId="studentId" :studentClass="studentClass" :openid="openid"></editStudent>
    </div>
</template>
<style scoped>
#studentListOut{
    transition: .2s;
    background: rgba(230, 230, 230, 1);
    box-shadow: -2px 4px 15px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(15px);
    z-index: 100;
    border-radius: 20px;
    height:80vh;
    margin-top:2vh;
    width:100%;
    position: absolute;
    top: 120vh;
    overflow-y: scroll;
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
.locked{
    height:30px;
    width:30px;
    margin-top:-5px;
    left:calc(100% - 25px);
    background-color:#FF7666;
    border-radius: 50%;
}
.unlocked{
    transition: .5s;
    height:30px;
    width:30px;
    margin-top:-5px;
    left:-5px;
    background-color:#43AA8B;
    border-radius: 50%;
}
</style>
<script>
import editStudent from "./editStudent.vue"
 export default{
     name:"Student",
     props:{
         studentList:{
            type:Array,
            default:[]
         },
     },
     data(){
         return{
             studentListData:this.studentList,
             showEditStudent:[],
             schoolId:"",
             schoolName:"",
             studentPassword:"",
             studentNumber:"",
             studentId:"",
             studentClass:"",
             openid:""
         }
     },
     components:{
         editStudent
     },
     created(){
         setTimeout(()=>{
             document.getElementById("studentListOut").style.top="45%"
             document.getElementById("studentListOut").style.transform="translateY(-50%)"
         },200)
     },
     methods:{
         showData:function(e){
            let index=e.target.dataset.index
            let number=this.studentListData[index].openid
            this.$emit("studentData",number)//学生编号
         },
        setStatus:function(e){
                let index=e.target.dataset.index*1
                let number=this.studentListData[index].number
                let openid=this.studentListData[index].openid
                let preStatus=this.studentListData[index].lock
                let text=preStatus?"解锁":"锁定"
                if(confirm("确认"+text+"学生"+this.studentListData[index].name+"(编号:"+number+")的账户?")){      
                    let http=new XMLHttpRequest()
                    let _this=this
                    http.open("POST","/api_back/back/lockStudent?openid="+openid)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.studentListData[index].lock=!preStatus
                                alert("已锁定")
                                }
                            }
                        }
                    http.send()

                }

            },
         close:function(){
             document.getElementById("studentListOut").style.top="150vh"
             setTimeout(()=>{
                 this.$emit("close")
             },600)
         },
         delStudent:function(e){
            let index=e.target.dataset.index*1
            let studentNumber=this.studentListData[index].number
            let openid=this.studentListData[index].openid
             if(confirm("确认删除学生"+studentNumber)){
                 let _this=this
                    let http=new XMLHttpRequest()
                    http.open("POST","/api_back/back/delStudent?openid="+openid)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.studentListData.splice(index,1)
                                alert("删除成功")
                        }}}
                    http.send()
             }
         },
        openEditStudent:function(e){
            let index=e.target.dataset.index
            let data=this.studentListData[index]
            console.log("学生",data)
            this.studentName=data["name"]
            this.studentClass=data["class"]
            this.schoolId=data["schoolId"]//学校代码
            this.schoolName=data["schoolName"]//学校名称
            this.studentPassword=data["pass"]//学生密码
            this.studentNumber=data["number"]//学生序号
            this.studentId=data["username"]//学生账号
            this.openid=data["openid"]//学生唯一标识
            this.showEditStudent=[1]
        },
        closeEditStudent:function(){
                this.showEditStudent=[]
        },
     }

 }
</script>
