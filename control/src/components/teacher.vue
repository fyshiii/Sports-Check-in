<template>
    <div id="teacherOut">
        <div id="searchArea" style="position:relative;height:auto;z-index:999">
            <h3 style="float:left;margin-left:30px" class="titleButton">学校</h3>
            <div class="selectDiv" id="schoolList" @click="openSchool" style="float:left;margin-left:30px;width:20%;font-size:120%;height:100%;margin-top:0%;font-weight:bold">{{schoolName}}</div>
            <h3 style="float:left;margin-left:30px;letter-spacing:5px" class="titleButton">教师编号</h3>
            <input class="selectDiv" id="selectTarget" style="text-align:center;outline:none;float:left;margin-left:30px;width:20%;font-size:120%;height:100%;margin-top:0%;font-weight:bold;border:none">
            <button style="float:left;margin-left:30px;letter-spacing:5px;font-weight:bold;font-size:120%" class="titleButton" @click="select">查询</button>
            <h4 style="clear:both"></h4>
            <schoolItemList v-for="(item,index) in schoolList" :key="index" style="top:0;left:0" @choseSchool="choseSchool" ></schoolItemList>
        </div>
        <div id="teacherList">
            <div class="teacherItemClass" v-for="(item,index) in teacherList_show" :key="index">
                <h4 class="teacherItem" style="width:5%;">{{index+1}}</h4>
                <h4 class="teacherItem" style="width:10%;">{{item.name}}</h4>
                <h4 class="teacherItem" style="width:15%;">{{item.number}}</h4>
                <button class="teacherItem" style="float:right;margin-right:20px;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white;background-color:#FF7676" :data-index="index" @click="delTeacher">删除</button>
                <div class="teacherItem" style="float:right;width:60px;border-radius:15px;height:20px;background-color:white;border:1px solid #8BA4FF;transform:translateY(5px)">
                    <button style="transition:.5s;position: absolute;" :data-index="index" :class="[item.lock ? 'locked':'unlocked']" @click="setStatus"></button>
                </div>
                <button class="teacherItem" style="float:right;background-color:#8BA4FF;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white" :data-index="index" @click="openEditTeacher">编辑信息</button>
                <button class="teacherItem" style="float:right;background-color:#8BA4FF;font-size:105%;font-weight:bold;letter-spacing:5px;border-radius:15px;padding-left:10px;padding-right:10px;color:white" :data-index="index" @click="openClass">查看所有班级</button>
            </div>
        </div>
    <Class v-for="(item,index) in showClass" :key="index" :classList_inter="classList" :userName="teacherNumber" style="z-index:9999;width:80%;left:10%;position:absolute;" @close="closeClass">

    </Class>
    <editTeacher v-for="(item,index) in showEditTeacher" :key="index" @closeEditTeacher="closeEditTeacher" :schoolIdInter="schoolId" :schoolNameInter="schoolName" :teacherName="teacherName" :teacherPassword="teacherPassword" :teacherNumber="teacherNumber" :teacherId="teacherId"> </editTeacher>
    
    </div>
</template>
<style scoped>
#teacherOut{
    overflow: hidden;
    width:80%;
    height:auto;
    margin-left:2%;
    margin-top:30px;
    border-radius:30px;
    background-color: white;
}
#teacherList{
    background: #F5F5F5;
    border-radius: 20px;
    height:75vh;
    margin-top:2vh;
    width:100%;
    position: relative;
    overflow-y: scroll;
}
input:active{
    border: none;
}
input:visited{
    border: none;
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
.selectDiv{
    padding: 10px;
    background: #FFFFFF;
    box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
}
.teacherItemClass{
    width:96%;
    position: relative;
    overflow: hidden;
    margin-top:10px;
    margin-left:2%;
    height:45px;
    background: #FFFFFF;
    border-radius: 15px;
}
.teacherItem{
    float:left;margin:0;height:30px;margin-top:10px;
    margin-left:10px;
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
    import editTeacher from "../components/editTeacher.vue"
    import Class from "./class.vue"
    import schoolItemList from "./choseSchool.vue"
    export default{
        name:"Teachers",
        data(){
            return{
                teacherList:[
                    
                ],
                teacherList_show:[],
                showClass:[],
                classList:[],
                showEditTeacher:[],
                schoolList:[],
                schoolId:10001,
                schoolName:"东华大学松江校区",
                teacherName:"",
                teacherPassword:"",
                teacherNumber:0,
                teacherId:0
            }
        },
        components:{
            Class,
            editTeacher,
            schoolItemList
        },
        mounted(){
            this.getTeacherList()
        },
        methods:{
            setStatus:function(e){
                let index=e.target.dataset.index*1
                let number=this.teacherList[index].number
                let preStatus=this.teacherList[index].lock
                let text=preStatus?"解锁":"锁定"
                if(confirm("确认"+text+"教师"+this.teacherList[index].name+"(编号:"+number+")的账户?")){
                    let http=new XMLHttpRequest()
                    let _this=this
                    http.open("GET","/api_back/back/lockTeacher?username="+number)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.teacherList[index].lock=!preStatus
                                alert("已锁定")
                                }
                            }
                        }
                    http.send()
                        
                }

            },
            openClass:function(e){//获取该教师管理下的班级列表
                    let http=new XMLHttpRequest()
                    let _this=this
                    let index=e.target.dataset.index*1
                    let number=_this.teacherList[index].number//教师编号
                    http.open("POST","/api_back/back/getClass?username="+number)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                let index=e.target.dataset.index*1
                                _this.teacherNumber=number
                                _this.classList=JSON.parse(http.responseText)
                                console.log("class",_this.classList)
                                _this.showClass=[1]
                            }
                        }}
                    http.send()
            },
            closeClass:function(){
                console.log("be",this.showClass)
                this.showClass=[]
                console.log("af",this.showClass)
            },
            openEditTeacher:function(e){
                let index=e.target.dataset.index
                let teacherpass=this.teacherList[index].pass
                let teacherName=this.teacherList[index].name
                let teacherId=this.teacherList[index].id
                let teacherNumber=this.teacherList[index].number
                this.teacherName=teacherName
                this.teacherPassword=teacherpass
                this.teacherNumber=teacherNumber
                this.teacherId=teacherId
                this.showEditTeacher=[1]
            },
            closeEditTeacher:function(){
                this.showEditTeacher=[]
            },
            delTeacher:function(e){
                let index=e.target.dataset.index*1
                let number=this.teacherList[index].number
                if(confirm("确认删除教师"+this.teacherList[index].name+"(编号:"+number+")的账户?")){
                    let _this=this
                    let http=new XMLHttpRequest()
                    http.open("POST","/api_back/back/delTeacher?username="+number)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.teacherList.splice(index,1)
                                alert("删除成功")
                        }}}
                    http.send()
                }
            },
            getTeacherList:function(){
                let _this=this
                    let http=new XMLHttpRequest()
                    http.open("GET","/api_back/back/getTeacherList?schoolid="+this.schoolId)
                    http.onreadystatechange=()=>{
                        if(http.status==200 && http.readyState==4){
                            if(http.responseText!="error"){
                                _this.teacherList=JSON.parse(http.responseText)
                                _this.teacherList_show=_this.teacherList
                        }}}
                    http.send()
            },
            select:function(e){
                let target=document.getElementById("selectTarget").value
                if(target==""){
                    this.teacherList_show=this.teacherList
                }else{
                try{
                        this.teacherList_show=[]
                        this.teacherList.forEach(ele => {
                            if (ele.number==target){
                                this.teacherList_show.push(ele)
                                return
                            }
                        })
                }catch(e){
                    alert("信息有误")
                }
                }

            },
            openSchool:function(){
            let ofss_left=document.getElementById("schoolList").offsetLeft
            let ofss_top=document.getElementById("schoolList").offsetTop
            let hei=document.getElementById("schoolList").offsetHeight
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
                this.getTeacherList()
            },
            closeSchool:function(){
                this.schoolList=[]
            }
        }
    }
</script>
