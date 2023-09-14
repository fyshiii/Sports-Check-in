let userData;
let schoolId=10001;
function setSchoolId(data){
    schoolId=data
}
function getScoolId(){
    return schoolId
}
function setUserId(data){
    userData=data
}
function getUserId(){
    return userData
}
export default({
    name:"DataStore",
    setUserId,
    getUserId,
    setSchoolId,
    getScoolId
})