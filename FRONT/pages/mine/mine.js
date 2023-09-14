// pages/mine/mine.js
var global=require("../global.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        image:"",
        name:"",
        number:0,
        school:"",
        userinfo:[],
        ex_record:[],
        times:0,
        record_top:100
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this=this
        wx.getStorage({
            key:"userImage",
            success:function(res){
                _this.setData({
                    image:res.data
                })
            }
        })
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
                let _this=this
        if(!global.getLogin()){
            wx.switchTab({
              url: '../home/home',
            })
        }else{
            wx.getStorage({
                key:"userid",
                success:function(openRes){
                    console.log("getOpenId",openRes)
                    wx.request({
                        url: 'http://localhost:8081/small/v1/getUserInfo?openid='+openRes.data,
                        success:function(res){
                            console.log(res)
                            let times=res.data.ex_record.length
                            _this.setData({
                                name:res.data.name,
                                number:res.data.number,
                                school:res.data.school,
                                times:times,
                                userinfo:res.data.userinfo,
                                ex_record:res.data.ex_record,
                            })
                        }
                      })
                }
            })
        }
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
    showRecord:function(){
        this.setData({
            record_top:20
        })
    },
    closeRecord:function(){
        this.setData({
            record_top:100
        })
    },
    contactUs:function(){
        wx.showModal({
            showCancel:false,
            content:"客服QQ:xxxxxxxxxx"
        })
    }
})