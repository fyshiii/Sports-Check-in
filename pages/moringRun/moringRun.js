const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.096994,
    longitude: 113.324520,
    markers: [],
    customCalloutMarkerIds: [],
    num: 1,
    distance: [],
    cost: '',
    polyline: [],
    circles: [{
      latitude: '23.099994',
      longitude: '113.324520',
      color: '#FF0000DD',
      fillColor: '#7cb5ec88',
      radius: 10,
      strokeWidth: 2
    }],
    destination: {
      lat: 0,
      long: 0
    },
    startButtonSrc: "../../static/start (2).png",
    startButtonLeft: 0,
    allpoints: [], //所有经过的经纬度
    chosedMarkers: [], //记录被选中的途经点
    chosedMarkserIndex: [],
    hasPlanWay: false, //记录是否已经选择规划路线
    animations: null,
    animations_showChoseDe: null,
    animations_readyRun_top: null,
    animations_map: null,
    animations_runway: null,
    animations_ball: null,
    animation_ready_top_angle: -90,
    animations_ready_bottom_top: 100,
    animations_ready_bottom_top: 100,
    time_mi: 0,
    time_sec: 0,
    time_v: 0,
    runDis: 0,
    throughPoint:[],
    time_inner:null,
    time_outer:null,
    time_outer_ball:null,
    time_outer_runway:null,
    hasApprochPoint:false,
    test: [0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'KQ3BZ-2R43U-MWAVX-BA2BK-LOHUH-HCFCP'
    });
  },
  come_baby: function (event) {
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gg: function (e) {
    return true
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //定点坐标19.521894,109.579377;19.519598,109.579315;19.519524,109.58197;19.521828,109.581985
      let _data = this
      let t = [0]
      for (let i = 0; i < this.data.markers.length; i++) {
        t.push(0)
      }
      this.setData({
        test: t
      })
      setTimeout(() => {
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success(res) {
            const latitude = res.latitude
            const longitude = res.longitude
            console.log(latitude,longitude)
            let staticPoint = [{
              id: 1,
              latitude: latitude,
              longitude: longitude,
              iconPath: '',
              customCallout: {
                anchorY: 0,
                anchorX: 20,
                display: 'ALWAYS',
              }
            }, {
              id: 2,
              latitude: 31.053588 ,
              longitude: 121.213041,
              iconPath: '../../static/location.png',
              customCallout: {
                anchorY: 0,
                anchorX: 20,
                display: 'ALWAYS',
              }
            }, {
              id: 3,
              latitude: 31.053606 ,
              longitude: 121.21122,
              iconPath: '../../static/55(1).png',
              customCallout: {
                anchorY: 0,
                anchorX: 20,
                display: 'ALWAYS',
              }
            }, {
              id: 4,
              latitude: 31.054766,
              longitude:  121.211126,
              iconPath: '../../static/55(1).png',
              customCallout: {
                anchorY: 0,
                anchorX: 20,
                display: 'ALWAYS',
              }
            }, {
              id: 5,
              latitude: 31.054744 ,
              longitude: 121.213014,
              iconPath: '../../static/55(1).png',
              customCallout: {
                anchorY: 0,
                anchorX: 20,
                display: 'ALWAYS',
              }
            }]

            //console.log(markers)
            _data.setData({
              latitude: latitude,
              longitude: longitude,
              markers: staticPoint,
              chosedMarkers: staticPoint,
              chosedMarkserIndex: [0],
              customCalloutMarkerIds: [2]
            })
            if (location == null) {
              _data.setData({
                destination: {
                  lat: latitude,
                  long: longitude
                }
              })
              console.log("xuanz", _data.data.destination)
            }
            console.log("hello")
            _data.sumMarkser()
            wx.showToast({
              title: '已规划路线',
              duration:2000
            })
          }
        })
        this.mapCtx = wx.createMapContext('myMap')

        var outer=setInterval(() => {
            console.log("runrun")
            let _this = this
            wx.getLocation({
              type: 'gcj02', //返回可以用于wx.openLocation的经纬度
              success(res) {
                const latitude =res.latitude //_this.data.latitude//res.latitude
                const longitude = res.longitude //_this.data.longitude//res.longitude
                _this.mapCtx.translateMarker({
                  markerId: 1,
                  duration: 500,
                  destination: {
                    latitude: latitude,
                    longitude: longitude
                  },
                  animationEnd() {
                    _this.setData({
                      latitude: latitude,
                      longitude: longitude
                    })
                    //console.log('animation end')
                    if(!_this.data.hasApprochPoint){
                        if (Math.abs(latitude - _this.data.markers[1].latitude) < 0.0001 && Math.abs(longitude - _this.data.markers[1].longitude) < 0.0001) {
                            _this.setData({
                                hasApprochPoint:true
                            })
                            wx.showModal({
                              confirmText:"取消",
                              title:"已到达打卡点，请打卡后开始跑步",
                              confirmText:"开始跑步",
                              success(res){
                                  if(res.confirm){
                                        _this.startRun()
                                    
                                  }
                              }
                            })
                          }
                    }
                  },
                  complete(res) {
                    //console.log('translateMarker', res)
                  }
                })}})},2000);
                if(this.data.time_outer==null){
                    this.setData({
                        time_outer:outer
                    })
                }
      }, 1000)
    


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
    chooseLocation.setLocation(null);
    if(this.data.startButtonLeft==-1)
      clearInterval(this.data.time_inner)
      clearInterval(this.data.time_outer)
  },
  sumMarkser: function () {
    let markers = this.data.chosedMarkers
    let polys = [],
      _dis = [];
    let _this = this
    for (let i = 0; i < markers.length - 1; i++) {
      qqmapsdk.direction({
        mode: 'walking', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from: markers[i].latitude + "," + markers[i].longitude,
        to: markers[i + 1].latitude + "," + markers[i + 1].longitude,
        success: function (res) {
          console.log(res);
          var ret = res;
          var coors = ret.result.routes[0].polyline,
            pl = [],
            pl2 = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            })
            _this.data.allpoints.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            })
          }
          var dis = [];
          console.log(res)
          for (var i = 0; i < res.result.routes.length; i++) {
            dis.push(res.result.routes[i].distance); //将返回数据存入dis数组，
          }
          console.log("dis",)
          _dis.push(dis)
          polys.push({
            points: pl,
            color: '#FF0000DD',
            width: 4
          })
          console.log('py2', pl, polys)
          _this.setData({
            distance: _dis,
            polyline: polys
          })
          console.log("this pl", _this.data.polyline)
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      })
    }
  },
  startRun:function(){
      let _this=this
      if(this.data.startButtonLeft==-1){
          wx.showModal({
              cancelColor:"#ff6b6b",
              cancelText:"终止",
              title:"中途不允许暂停，可终止跑步，但若未达标将不记录此次",
              success(res){
                  if(res.confirm){
                      wx.showToast({
                        title: '继续跑步',
                        duration:1000
                      })
                  }else{
                      clearInterval(_this.data.time_inner)
                      wx.showToast({
                        title: '跑步终止',
                        duration:2000
                      })
                      setTimeout(()=>{          
                        wx.navigateBack({
                          delta: 1,
                        })
                      },2000)
                  }
              }
          })
      }
      else{
          let sen=this.data.hasApprochPoint
          let _this=this
    if(!this.data.hasApprochPoint){
        wx.showModal({
          cancelText:"仍要开始",
          title:"为保证满足时长条件，请打卡后开始跑步",
          success(res){
              if(!res.confirm)
              {
                  sen=true
                  _this.setData({
                      hasApprochPoint:true
                  })
              }
          }
        })
    }
    if(sen){
        this.setData({
            startButtonSrc: "../../static/pause.png",
            startButtonLeft: -1
          })
          wx.showToast({
            title: '开始计时',
            duration:2000
          })
        if(this.data.time_inner==null){
            var inner=setInterval(()=>{
            let sec=this.data.time_sec
            let min=this.data.time_mi
            sec+=1
            if(sec>=60){
              min+=1
              sec=0
            }
            this.setData({
              time_mi:min,
              time_sec:sec
            })
          },1000)
          this.setData({
            time_inner:inner
          })
        }
        }
    }
  }
})