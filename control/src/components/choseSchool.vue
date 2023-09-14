<template>
    <div id="schoolFrame">
        <button class="schoolItem" v-for="(item,index) in dataList" :key="index" :data-id="item.number" :data-name="item.name" @click="chose">{{item.name}}</button>
    </div>
</template>
<style scoped>
#schoolFrame{
    position: absolute;
    width: 15vw;
    overflow-y: scroll;
    height:0vh;
    background-color: rgba(250,250,250,0.8);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    box-shadow: -5px 5px 10px rgba(150,150,150,0.8);
}
.schoolItem{
    font-size: 115%;
    white-space:nowrap;
    color: #8BA4FF;
    width: 100%;
    height: 45px;
    background-color: transparent;
}
</style>
<script>
export default{
    name:"schoolItemList",
    data(){
        return{
            dataList:[]
        }
    },
    mounted(){
            let path="http:/120.46.132.25/api_back/back/getSchoolList"
            let _this=this    
            let http=new XMLHttpRequest()
            http.open("GET",path) 
            http.onreadystatechange=()=>{
                if(http.status==200 && http.readyState==4){
                    if(http.responseText!="error"){
                        _this.dataList=JSON.parse(http.responseText)["schoolList"]
                        console.log(_this.dataList)
                    }}}
            http.send()
    }
    ,methods:{
        chose:function(e){
            console.log(e.target.dataset)
            let id=e.target.dataset.id
            console.log("id",id)
            let name=e.target.dataset.name
            this.$emit("choseSchool",{id:id,name:name})
        }
    }

}
</script>
