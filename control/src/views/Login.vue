<template>
    <div id="loginOut">
        <span class="backCircle" style="background-color:#FFA41D;width:300px;height:300px;border-radius:50%;left:35%;top:10%"></span>
        <span class="backCircle" style="background-color:#8CD87E;width:180px;height:180px;border-radius:50%;left:15%;bottom:10%"></span>
        <span class="backCircle" style="background-color:#ACC2FC;width:260px;height:260px;border-radius:50%;right:10%;top:30%"></span>
        <div class="loginForm">
            <div style="width:100%;height:100%;position:relative">
                <h2 style="letter-spacing:5px;background-color:#8BA4FF;color:white;width:50%;border-radius:15px;margin-left:25%">管理登录</h2>
            
                <h3 style="float:left;margin:0;margin-left:10%;margin-top:20%;size:5">用户名:</h3>
                <input v-model="username" style="margin-top:20%;float:left;width:50%;height:30px;transform:translateY(-5%);border:none;border-bottom:1px solid #8BA4FF;border-radius:15px;margin-left:10px;text-align:center" placeholder="请输入用户名" >
                <h3 style="clear:both;float:left;margin:0;margin-left:10%;margin-top:40px;size:5">密&nbsp;&nbsp;&nbsp;&nbsp;码:</h3>
                <input v-model="password" style="margin-top:40px;float:left;width:50%;height:30px;transform:translateY(-5%);border:none;border-bottom:1px solid #8BA4FF;border-radius:15px;margin-left:10px;text-align:center" placeholder="请输入密码">
                <button style="letter-spacing:10px;width:50%;height:40px;background-color:#8BA4FF;border:none;outline:none;font-size:150%;text-align:center;color:white;border-radius:20px;margin-top:20%" @click="login">登录</button>
                <h3 v-if="showError" style="color:#F4BABA">登录信息错误</h3>
            </div>
        </div>
        <!--div id="test">
            <div id="test_2">
                
            </div>
            <div id="test_body">
                
            </div>
        </div-->

        <img src="../static/index.png" style="position:absolute;transform:scale(0.3);transform-origin:left top;left:8vw;top:0px;z-index:7"/>
        <img src="../static/login_index1.png" style="width:50vw;height:55vh;border-radius:50px;position:absolute;opacity:0.8;left:50%;transform:translateX(-50%);top:30vh;z-index:9"/>
    </div>
</template>
<style scoped>
#test{
    position: absolute;
    top:0;
    z-index: 999;
    left:7vw;
    width:10vw;
    height:30vh;
    background-color: rgba(230,230,230,0.6);
}
#test_2{
    position: absolute;
    top:0;
    z-index: 1000;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(230,230,230,0.6);
    backdrop-filter: blur(10px);
}
#test_body{
    position: absolute;
    top:5vh;
    z-index: 1000;
    left:10vw;
    width:10vw;
    height:30vh;
    background-color: rgba(230,230,230,0.6);
    backdrop-filter: blur(10px);
}
::placeholder{
    margin-left:5px;
}
::-webkit-input-placeholder{
    margin-left:10px;
}
:-ms-input-placeholder{
    margin-left: 10px;
}
 #loginOut{
     position: relative;
     width:96vw;
     height: 96vh;
     margin-left:50%;
     transform: translateX(-50%);
     border-radius: 30px;
     box-shadow: 0 0 30px rgb(89, 146, 199);
 }
 .backCircle{
     z-index: 8;
     position: absolute;
     filter: blur(10px);
 }
 .loginForm{
     z-index: 10;
     position: absolute;
     height:60vh;
     width:20vw;
     background-color: rgba(255,255,255,0.7);
     right:10vw;
     top:50%;
     transform: translateY(-50%);
     border-radius: 30px;
     box-shadow: -5px 5px 15px rgba(150,150,150,0.5);
     backdrop-filter: blur(15px);
 }
</style>
<script>
import axios from "axios"
import DataStore from "../components/data.js"
export default{
    name:"Login",
    data() {
        return {
            username:"",
            password:"",
            showError:false
        }
    },
    methods:{
            login:function(){
                if(this.username =="" || this.password ==""){
                    this.showError=true
                }
                else{
                                let http=new XMLHttpRequest()
                                let _this=this
            http.open("POST","/api_back/back/userLogin")
            http.onreadystatechange=()=>{
                if(http.status==200 && http.readyState==4){
                    if(http.responseText!="error"){
                        let role=http.responseText
                        console.log("登陆成功")
                        DataStore.setUserId({name:_this.username,role:role})
                        this.$router.push("/control")
                    }
                    else{
                        console.log("err")
                        this.showError=true
                    }
                }
            }
            http.send(JSON.stringify({
                'username':this.username,
                'password':this.password}
            ))
                    /*let _this=this
                    axios.post('/back/userLogin',{
                        params:{
                            username:_this.username,
                            password:_this.password
                        } 
                    }).then((response)=>{
                        if(response.status==200){
                            console.log("登录成功")
                        }
                    }).catch((error)=>{
                        console.log(error)
                    })*/
                }
            }
    }
}
</script>
