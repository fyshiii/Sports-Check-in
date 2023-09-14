// pages/planRun/planRun.js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var global=require("../global.js")
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
    startButtonLeft: 2,
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
    let _this=this
    //定点坐标19.521894,109.579377;19.519598,109.579315;19.519524,109.58197;19.521828,109.581985
    wx.request({
      url: 'http://localhost:8081/small/v1/pointAvaliable?openid='+global.getOpenid(),
      success:function(res){
        if(res.data=="success"){
          const location = chooseLocation.getLocation();
          if (location != null) {
            console.log("坐标点1",location.latitude,location.longitude)
            _this.data.destination.lat = location.latitude
            _this.data.destination.long = location.longitude
            let points = [],
              showList = []
            for (let i = 0; i < _this.data.chosedMarkers.length; i++) {
              let iocnpath = '../../static/location.png'
              points.push({
                id: i + 2,
                latitude: _this.data.chosedMarkers[i].latitude,
                longitude: _this.data.chosedMarkers[i].longitude,
                iconPath: iocnpath,
                customCallout: {
                  anchorY: 0,
                  anchorX: 20,
                  display: 'ALWAYS',
                }
              })
              showList.push(i + 1)
            }
            points.push({
              id: showList.length + 1,
              latitude: location.latitude,
              longitude: location.longitude,
              iconPath: '../../static/location.png',
              customCallout: {
                anchorY: 0,
                anchorX: 20,
                display: 'ALWAYS',
              }
            })
            let markers = []
            _this.setData({
              markers: points,
              //circle:{latitude:location.latitude,longitude:location.longitude},
              chosedMarkers: points,
              customCalloutMarkerIds: showList
            })
          } else {
            let _data = _this
            let t = [0]
            for (let i = 0; i < _this.data.markers.length; i++) {
              t.push(0)
            }
            _this.setData({
              test: t
            })
            setTimeout(() => {
              wx.getLocation({
                type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                success(res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  let staticPoint = [{
                    id: 1,
                    latitude: latitude,
                    longitude: longitude,
                    iconPath: '../../static/location.png',
                    customCallout: {
                      anchorY: 0,
                      anchorX: 20,
                      display: 'ALWAYS',
                    }
                  }, {
                    id: 2,
	                  latitude: 31.054106 ,
                    longitude: 121.220504,
                    iconPath: '../../static/location.png',
                    customCallout: {
                      anchorY: 0,
                      anchorX: 20,
                      display: 'ALWAYS',
                    }
                  }, {
                    id: 3,
                    latitude: 31.052106 ,
              longitude: 121.220004,
                    iconPath: '../../static/location.png',
                    customCallout: {
                      anchorY: 0,
                      anchorX: 20,
                      display: 'ALWAYS',
                    }
                  }, {
                    id: 4,
                    latitude: 31.051106 ,
              longitude: 121.219504,
                    iconPath: '../../static/location.png',
                    customCallout: {
                      anchorY: 0,
                      anchorX: 20,
                      display: 'ALWAYS',
                    }
                  }, {
                    id: 5,
                   latitude: 31.054106 ,
              longitude: 121.218504,
                    iconPath: '../../static/location.png',
                    customCallout: {
                      anchorY: 0,
                      anchorX: 20,
                      display: 'ALWAYS',
                    }
                  }]
                  wx.getStorage({
                    key:"userid",
                    success:function(openId){
                      wx.request({
                        url:"http://localhost:8081/small/v1/getPoint?openid="+openId.data,
                        success:function(points){
                          staticPoint=[{
                            id: 1,
                            latitude: latitude,
                            longitude: longitude,
                            iconPath: '../../static/location.png',
                            customCallout: {
                              anchorY: 0,
                              anchorX: 20,
                              display: 'ALWAYS',
                            }
                          }]
                          console.log("getPoint",points.data)
                          let idINdex=2
                          points.data.forEach(point => {
                            let sp=point.coord.split(",")
                            let la=sp[0]*1,lo=sp[1]*1
                            staticPoint.push({
                              id: idINdex,
                              latitude: la,
                              longitude: lo,
                              iconPath: '../../static/location.png',
                              customCallout: {
                                anchorY: 0,
                                anchorX: 20,
                                display: 'ALWAYS',
                              }
                            })
                            idINdex++
                          })
                          //console.log(markers)
                          let chosed = []
                          chosed.push(staticPoint[0])
                          _data.setData({
                            latitude: latitude,
                            longitude: longitude,
                            markers: staticPoint,
                            chosedMarkers: chosed,
                            chosedMarkserIndex: [0],
                            customCalloutMarkerIds: [2,3,4,5]
                          })
                          if (location == null) {
                            _data.setData({
                              destination: {
                                lat: latitude,
                                long: longitude
                              }
                            })
                            
                          }
                          _this.chosePoint()
                        }
                      })
                    }
                  })


                }
              })
              _this.mapCtx = wx.createMapContext('myMap')
            }, 1000)
          }
        }
        else{
          wx.showModal({
            showCancel:false,
            content:"今日打卡次数已达上限",
            success:function(re){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
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
    chooseLocation.setLocation(null);
    if(this.data.startButtonLeft==1)
      this.pauseRun()
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
  onShareAppMessage: function () {},
  getNowLocation: function () {
    let _data = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude)
        _data.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  //终点选点
  chose: function () {
    var _this = this
    const key = 'KQ3BZ-2R43U-MWAVX-BA2BK-LOHUH-HCFCP'; //使用在腾讯位置服务申请的key
    const referer = 'IRUN'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: _this.data.latitude,
      longitude: _this.data.longitude
    });
    const category = '生活服务,娱乐休闲';

    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
    })
  },
  //选择途经点
  chosePoint: function (e) {
    //console.log(e.detail, "ee")
    //let index = e.target.id.split("_")[1] * 1 //+1为id
    /*if (this.data.chosedMarkserIndex.indexOf(index) >= 0) {
      let t = this.data.test
      t[index] = 0
      this.setData({
        test: t
      })
      let innerIndex = this.data.chosedMarkserIndex.indexOf(index)
      let mar = this.data.chosedMarkers
      mar.splice(innerIndex, 1)
      let tempChosed = this.data.chosedMarkserIndex
      tempChosed.splice(innerIndex, 1)
      this.setData({
        chosedMarkserIndex: tempChosed,
        chosedMarkers: mar
      })
      wx.showToast({
        title: '取消选中',
        duration: 1000
      })*/
    //} else {
      /*wx.showToast({
        title: '选中' + index + "点",
        duration: 1000
      })*/
      /*let t = this.data.test
      t[index] = 1
      this.setData({
        test: t
      })*/
      let randomIndexList=this.randomArray(5)
      let randoml=[]
      for(let i=0;i<3;i++){
        randoml.push(randomIndexList[i])
      }
      randomIndexList=randoml
      console.log("选择途经点",randomIndexList)
      let _this=this 
      let chosedMarkers=this.data.chosedMarkers
      let chosedMarkserIndex=this.data.chosedMarkserIndex
      randomIndexList.forEach(i => {
        console.log(_this.data.markers[i])
        chosedMarkers.push(_this.data.markers[i])
        chosedMarkserIndex.push(i)
        
      })
      this.setData({
        chosedMarkers,
        chosedMarkserIndex
      })
      console.log("ele",this.data.chosedMarkers,this.data.chosedMarkserIndex)
      this.toChoseDestination()
   // }
  },
  startRun: function () {
    wx.showToast({
      title: '即将开始跑步',
      duration:3000
    })
    if(this.data.startButtonLeft==1){
      this.pauseRun()
    }else{
      this.setData({
        startButtonSrc: "../../static/pause.png",
        startButtonLeft: 1
      })
      
      var outer_runway=setInterval(() => {
          var animation = wx.createAnimation({
            delay: 0,
            duration: 1500,
            timingFunction: 'linear'
          })
          this.animation = animation
          animation.left("-70vw").step().left(0).step()
          this.setData({
            animations_runway: animation.export()
          })
        }, 3050)
      var outer_ball=setInterval(() => {
          var animation = wx.createAnimation({
            delay: 0,
            duration: 400,
            timingFunction: 'linear'
          })
          this.animation = animation
          animation.bottom("10vh").step().bottom("2vh").step()
          this.setData({
            animations_ball: animation.export()
          })
        }, 800)
      
      let index = 0
      var outer=setInterval(() => {
        let _this = this
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success(res) {
            const latitude = res.latitude //_this.data.latitude//res.latitude
            const longitude = res.longitude //_this.data.longitude//res.longitude
            _this.mapCtx.translateMarker({
              markerId: 1,
              duration: 500,
              destination: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              animationEnd() {
                _this.setData({
                  latitude: res.latitude,
                  longitude: res.longitude
                })
                //console.log('animation end')
                index++
              },
              complete(res) {
                //console.log('translateMarker', res)
              }
            })
            qqmapsdk.direction({
              mode: 'walking', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
              //from参数不填默认当前地址
              from: _this.data.latitude + "," + _this.data.longitude,
              to: latitude + "," + longitude,
              success: function (res) {
                console.log(res);
                var ret = res;
                //坐标解压（返回的点串坐标，通过前向差分进行压缩）
                var kr = 1000000;
                var dis = [];
                console.log(res)
                for (var i = 0; i < res.result.routes.length; i++) {
                  dis.push(res.result.routes[i].distance); //将返回数据存入dis数组，
                }
                let distance=0
                for(let index=0;index<dis.length;index++){
                  distance+=dis[index]
                }
                distance+=_this.data.runDis
                _this.setData({
                  runDis:distance,
                  latitude:latitude,
                  longitude:longitude
                })
              }})
            for (let i = 1; i < _this.data.markers.length; i++) {
//              console.log(longitude, _this.data.chosedMarkers[i].longitude)
//              console.log("now", index, latitude, _this.data.chosedMarkers[i].latitude, latitude - _this.data.chosedMarkers[i].latitude, longitude - _this.data.chosedMarkers[i].longitude, Math.abs(latitude - _this.data.chosedMarkers[i].latitude) < 0.004, Math.abs(longitude - _this.data.chosedMarkers[i].longitude) < 0.004)
              if (Math.abs(latitude - _this.data.markers[i].latitude) < 0.0001 && Math.abs(longitude - _this.data.markers[i].longitude) < 0.0001) {
                wx.showToast({
                  title: '经过途经点' + i,
                  duration: 1000
                })
                if(_this.data.throughPoint.indexOf(i)<0){
                  let point=_this.data.throughPoint
                  point.push(i)
                  _this.setData({
                    throughPoint:point
                  })
                }
              }
            }
          }
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
            if(this.data.runDis!=0){
              let s_=this.data.runDis
              let s=s_/1000
              let t_mi=this.data.time_mi
              let t_sec=this.data.time_sec
              let v1=parseInt(t_mi/s)
              let v2=parseInt(t_sec/s)
              let ps=v1+"."+v2
              this.setData({
                time_v:ps
              })
            }
          },1000)
          this.setData({
            time_inner:inner
          })
        }
      }, 3000)
      if(this.data.time_outer==null){
        this.setData({
          time_outer:outer,
          time_outer_ball:outer_ball,
          time_outer_runway:outer_runway
        })
      }
    }


  },
  pauseRun:function(type=0){
    clearInterval(this.data.time_inner)
    clearInterval(this.data.time_outer)
    clearInterval(this.data.time_outer_ball)
    clearInterval(this.data.time_outer_runway)
    this.setData({
      startButtonSrc: "../../static/start (2).png",
      startButtonLeft: 2
    })
    this.setData({
      time_inner:null,
      time_outer:null,
      time_outer_runway:null,
      time_outer_ball:null
    })
    if(type==0)
      wx.showToast({
        title: '跑步已暂停',
        duration:1000
      })
  },
  randomArray:function(num) {
    var aLuanXu=[];
    for (var i = 0; i < num; i++) {
      aLuanXu[i] = i;
    }
    aLuanXu.sort(function(){return Math.random()>0.5 ?-1:1;})
    return aLuanXu;
},
  endRun:function(){
    let dis=this.data.runDis
    let points=this.data.throughPoint
    let sen_dis=dis>2000
    let sen_points=points.length>=3
    let sen_v=this.data.time_v<10
    let t=sen_dis && sen_points && sen_v
    let text= t ? "合格" : "不合格"
    if(this.data.startButtonLeft==1){
      this.pauseRun(1)
      let _this=this
      wx.showModal({
        title: '本次跑步'+text,
        content: '确认结束跑步?',
        success (res) {
          if (res.confirm) {
            if(t){//跑步合格
              wx.showToast({
                title: '跑步结束',
                duration:1000
              })
              let ex_time=_this.data.time_mi+(_this.data.time_sec/100)
              wx.request({
                url: 'http://localhost:8081/small/v1/record?type=run&openid='+global.getOpenid()+"&time="+ex_time+"&dis="+dis,
                success:function(result){
                  if(result.data=="success"){
                    wx.showToast({
                      title: '记录成功',
                      duration:2000
                    })
                  setTimeout(()=>{
                    wx.navigateBack({
                      delta: 1,
                    })},2000)
                  }
                }
              })
            }else{
              wx.showModal({
                showCancel:false,
                content:"跑步结束，本次不记录",
                confirm:"确定"
              }).then(()=>{
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1,
                  })},1000)
              })
            }
            _this.setData({
              time_mi: 0,
              time_sec: 0,
              time_v: 0,
              runDis: 0,
              throughPoint:[],
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '跑步已暂停',
              duration:1000
            })
          }
        }
      })
    }

  },
  goDetail: function () {
    wx.navigateTo({
      url: '../navigation_car_detail/navigation'
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation'
    })
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
  markertap: function (e) {
    let id = e.detail.markerId
    let _this = this.data
    if (id == 1) {
      wx.showModal({
        showCancel: false,
        title: "操作提示",
        content: "不允许选择起点为途经点",
        confirmColor: "#4CB4FF"
      })
    } else {
      let index = id * 1
      if (this.data.chosedMarkserIndex.indexOf(index - 1) >= 0) {
        wx.showToast({
          title: '该点已被选中',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '选中' + (index - 1) + "点",
          duration: 1000
        })
        let t = this.data.test
        t[index - 1] = 1
        this.setData({
          test: t
        })
        this.data.chosedMarkers.push(this.data.markers[index - 1])
        this.data.chosedMarkserIndex.push(index - 1)
      }
    }
  },
  toChoseDestination: function () {
    console.log("show", this.data.chosedMarkers, this.data.chosedMarkserIndex)
    var animation = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "ease"
    })
    this.animation = animation
    animation.left("-90vw").step()
    this.setData({
      animations: animation.export()
    })
    var animation = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "ease"
    })
    this.animation = animation
    animation.left("2vw").step()
    this.setData({
      animations_showChoseDe: animation.export()
    })

  },
  toReadyStart: function () {
    var animation = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: 'ease'
    })
    this.animation = animation
    animation.height("40%").width("65vw").left("20vw").step()
    this.setData({
      animations_map: animation.export()
    })
    this.setData({
      animations_ready_bottom_top: 35,

    })
    setTimeout(() => {

      this.setData({
        animations_ready_top_top: 0,
        animation_ready_top_angle: 0
      })
    }, 300)


  },
  backToChosePoint:function(){
    var animation = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "ease"
    })
    this.animation = animation
    animation.left("2vw").step()
    this.setData({
      animations: animation.export()
    })
    var animation = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "ease"
    })
    this.animation = animation
    animation.left("90vw").step()
    this.setData({
      animations_showChoseDe: animation.export()
    })
  }
})