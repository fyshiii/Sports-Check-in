<template>
    <div>
        <button id="test" @contextmenu="right" style="width:100px;height:100px;background-color:red"></button>
        <div class="option" id="option"></div>
    </div>
</template>
<style scoped>
.option{
    position: absolute;
    width:0;
    height: 300px;
    transition:0;
    background:rebeccapurple
}
</style>
<script>
export default{
    name:"Test",
    methods:{
        right:function(e){
            e.preventDefault()
            let x=e.target.offsetLeft+e.target.offsetWidth+10,y=e.target.offsetTop
            document.getElementById("option").style.top=y+"px"
            document.getElementById("option").style.left=x+"px"
            document.getElementById("option").style.transition=".5s"
            document.getElementById("option").style.width="150px"
            setTimeout(()=>{
                document.getElementById("option").style.transition="0"
            },500)
        }
    }
}
</script>
