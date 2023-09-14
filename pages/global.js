var data=10
var login=false
var openid=""
function getLogin(){
    return login
}
function setLogin(t){
    login=t
}
function setOpenid(id){
    openid=id
}
function getOpenid(){
    return openid
}
module.exports={
    getLogin,
    setLogin,
    setOpenid,
    getOpenid
    }