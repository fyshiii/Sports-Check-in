// pages/setInfo/setInfo.js
var global=require("../global.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:"",
        number:0,
        school:0,
        scholNumberTop:100,
        schoolList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let _this=this
        wx.request({
          url: 'http://localhost:8081/small/v1/getSchoolList',
          success:function(res){
            _this.setData({
                schoolList:res.data.schoolList
            })
          }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    showSchoolList:function(){
        this.setData({
            scholNumberTop:3
        })
    },
    closeSchoolList:function(){
        this.setData({
            scholNumberTop:100
        })
    },
    setName:function(e){
        console.log(e.detail.value)
        this.setData({
            name:e.detail.value
        })
    },
    setnumber:function(e){
        this.setData({
            number:e.detail.value
        })
    },
    setschool:function(e){
        this.setData({
            school:e.detail.value
        })
    },
    setInfo:function(){
        if(this.data.name !="" && this.data.number!=0 && this.data.school!=0){
            console.log("setINTo",global.getOpenid())
            wx.request({
                url: 'http://localhost:8081/small/v1/setInfo?openid='+global.getOpenid().openid+"&name="+this.data.name+"&number="+this.data.number+"&school="+this.data.school,
                success:function(res){
                    if(res.data=="success"){
                        wx.showToast({
                            title: '设置成功',
                            duration:2000
                          })
                          setTimeout(()=>{
                             wx.switchTab({
                               url: '../home/home',
                             })
                          },2000)
                    }else{
                        wx.showModal({
                            showCancel:false,
                            content:"设置失败，请联系客服；客服QQ:xxxxxxxxxx"
                        })
                    }
                },
                fail:function(){
                    wx.showModal({
                        showCancel:false,
                        content:"设置失败，请联系客服；客服QQ:xxxxxxxxxx"
                    })
                }
              })
        }   else{
            wx.showModal({
                showCancel:false,
                content:"请确保信息填写完成"
            })
        }

    }
})