<template>
    <div id="controlMain">
        <header class="header"></header>
        <div class="left-list">
            <button class="left-list-button" :class="[nowModelName=='class' ? 'class_selected' :'class_unselected']" data-sec="class" v-if="role=='teacher'"  @click="change">班级列表</button>
            <button class="left-list-button" :class="[nowModelName=='dashBord' ? 'class_selected' :'class_unselected']" data-sec="dashBord" v-if="role=='manager'" @click="change">全局数据</button>
            <button class="left-list-button" :class="[nowModelName=='teachers' ? 'class_selected' :'class_unselected']" data-sec="teachers" v-if="role=='manager'" @click="change">教师列表</button>
            <button class="left-list-button" :class="[nowModelName=='student' ? 'class_selected' :'class_unselected']" data-sec="student"  @click="change">学生信息</button>
            <button class="left-list-button" :class="[nowModelName=='position' ? 'class_selected' :'class_unselected']" data-sec="position" v-if="role=='manager'" @click="change">坐标设置</button>
        </div>
        <dash-bord style="float:left" v-if="nowModelName == 'dashBord' && role=='manager'"></dash-bord>
        <Teachers style="float:left" v-if="nowModelName == 'teachers' && role=='manager'"></Teachers>
        <showPoint style="float:left" v-if="nowModelName == 'position' && role=='manager'"></showPoint>
        <studentControl style="float:left" v-if="nowModelName == 'student'" :isControl="isControl"></studentControl>
        <Class style="float:left;width:80vw;position:relative;margin-left:2vw;height:84vh;margin-top:0" v-if="nowModelName == 'class' && role=='teacher'" :userName="userName" :role="role"></Class>
    </div>
</template>
<style scoped>
#controlMain{
    width:98vw;
    height: 96vh;
    margin-left:0.5vw;
}
.header{
    width: 100%;
    height: 35px;
    background-color: #8BA4FF;
    border-radius: 30px;
}
.left-list{
    float: left;
    text-align: center;
    height:90%;
    width:15%;
    margin-top: 30px;
    border-radius: 30px;
    background-color: #F2F2F2;
    opacity: 0.8;
}
.left-list-button{
    transition: .5s;;
    width: 80%;
    height:40px;
    margin-top: 20px;
    font-size: 125%;
    border: none;
    outline: none;
    border-radius: 15px;
}
.class_selected{
    background-color: white;
    color: #8BA4FF;
}
.class_unselected{
    background-color: #8BA4FF;
    color: white;
}
</style>
<script>
import dashBord from "../components/dashBord.vue"
import Teachers from "../components/teacher.vue"
import showPoint from "../components/showPoint.vue"
import studentControl from "../components/studentControl.vue"
import Class from "../components/class.vue"
import DataStore from "../components/data.js"
export default{
    name:"Control",
    data(){
        return{
            nowModelName:"dashBord",
            role:null,
            userName:null,
            isControl:true
        }
    },
    components:{
        dashBord,
        Teachers,
        showPoint,
        studentControl,
        Class
    },

    created(){
        console.log("se",this.isControl)
        let data=DataStore.getUserId()
        console.log(data)
        this.role=data.role
        if(this.role!="teacher"){
            this.isControl=true
        }else{
            this.isControl=false
        }
        if(this.role=="teacher"){
            this.nowModelName="class"
        }
        this.userName=data.userName
    },
    methods:{
        change:function(e){
            let modelName=e.target.dataset.sec
            this.nowModelName=modelName
        }
    }
}
</script>
