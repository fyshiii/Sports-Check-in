// pages/setting/setting.js
var global=require("../global.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nowshow:"",
        prepass:"",
        newpass_1:'',
        newpass_2:""
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
    close:function(){
        this.setData({
            nowshow:""
        })
    },
    showQuestion:function(){
        this.setData({
            nowshow:"question"
        })
    },
    showPassword:function(){
        this.setData({
            nowshow:"password"
        })
    },
    showNotice:function(){
        this.setData({
            nowshow:"notice"
        })
    },
    showAgreement:function(){
        this.setData({
            nowshow:"agreement"
        })
    },
    showScret:function(){
        this.setData({
            nowshow:"secret"
        })
    },
    showChange:function(){
        wx.showModal({
            showCancel:false,
            content:"请联系客服，并提供身份证明"
        })
    },
    saveChangePassword:function(){
        let _this=this
        if(this.data.newpass_1 != this.data.newpass_2){
            wx.showModal({
                showCancel:false,
                content:"两次新密码不一致"
            })
        }else{
            wx.request({
              url: 'http://localhost:8081/small/v1/resetPass?openid='+global.getOpenid()+"&newpass="+this.data.newpass_2,
              success:function(res){
                  if(res.data=="success"){
                      wx.showModal({
                          showCancel:false,
                          content:"修改成功!",
                          success:function(){
                              _this.close()
                          }
                      })
                  }
                  else{
                    wx.showModal({
                        showCancel:false,
                        content:"修改失败，请检查原密码是否正确",
                    })
                  }
              }
            })
        }
    },
    setPrePass:function(e){
        console.log(e.detail.value)
        this.setData({
            prepass:e.detail.value
        })
        
    },
    setnewpass_1:function(e){
        this.setData({
            newpass_1:e.detail.value
        })
    },
    setnewpass_2:function(e){
        this.setData({
            newpass_2:e.detail.value
        })
    },
})