const app=getApp()
var wxCharts = require('../../utils/dist/wxcharts.js');
import * as echarts from '../../utils/echart/ec-canvas/echarts';
var global= require("../global.js")
// 2、进行初始化数据
let dates=[20,21,22,23,24,25],time=[18,22,0,25,36,20],distance=[2523,2125,0,2200,2345,2134],times=7,dis=0,kaluli=0,rank=1;
var option = {
  title: {
    text: '七日运动量',
    left: 'center'
  },
  color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
  legend: {
    data: ["时间"],
    top: 30,
    left: 'center',
    backgroundColor: 'transparent',
    z: 100
  },
  grid: {
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dates,
    // show: false
  },
  yAxis: {
    x: 'center',
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
    // show: false
  },
  series: [{
    name: '时间',
    type: 'line',
    smooth: true,
    data: time
      }]
} 
var option_dis = {
  color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
  legend: {
    data: ["距离"],
    top: 30,
    left: 'center',
    backgroundColor: 'transparent',
    z: 100
  },
  grid: {
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dates,
    // show: false
  },
  yAxis: {
    x: 'center',
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
    // show: false
  },
  series: [{
    name: '距离',
    type: 'line',
    smooth: true,
    data: distance
  }]
} 
var chart_1,chart_2
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  chart_1=chart
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}
function initChart_dis(canvas,width,height){
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart_2=chart
  chart.setOption(option_dis);
  return chart;
}
Page({
    data:{
        name:"七日运动量报表",
        people:1500,
        ec: {
          onInit: initChart // 3、将数据放入到里面
        },
        ec_dis:{
          onInit:initChart_dis
        },
        times:times,
        distance:dis,
        kaluli:kaluli,
        rank:rank,
        login:false,
        reLogin:false,
        js_code:"",
        dates:dates,
        time:time,
        openid:"",
        distance_len:distance,
    },
    come_baby:function(event){
        wx.switchTab({
          url: '../home/home',
        })
      },
    login:function(){
      let _this=this
      wx.showLoading({
        title: '正在获取用户信息',
      })
      setTimeout(()=>{
        wx.checkSession({
          success (res) {
            console.log("enter",res)
            //session_key 未过期，并且在本生命周期一直有效
            wx.getStorage({
              key:"userid",
              success:function(res){
                console.log("test",res.data)
                wx.hideLoading()
                if(res.data){
                  console.log("test success",res.data)
                  wx.request({
                    url: 'http://localhost:8081/small/v1/checkUser?openid='+res.data,
                    success:function(resq){
                      if(resq.data=="success"){
                        _this.setData({
                          openid:res.data,
                          login:true
                        })
                        wx.showToast({
                          title: '登录成功',
                          duration:2000
                        })
                        console.log("登录id",res.data)
                        global.setOpenid(res.data)
                        global.setLogin(true)
                          _this.setIndexData()
                      }
                      else if(res.data=="info_error"){
                        global.setOpenid(res.data)
                        global.setLogin(true)
                        
                        wx.navigateTo({
                          url: '../setInfo/setInfo',
                        })
                      }else{
                        wx.showToast({
                          title: '请重新登录',
                          icon:"error",
                          duration:2000
                        })
                        wx.removeStorage({
                          key: 'userid',
                        })
                        _this.setData({
                          reLogin:true
                        })
                      }
                    }})
                }
                else{
                  wx.showToast({
                    icon:"error",
                    title: '请重新登录',
                    duration:2000
                  })
                  wx.login({
                    success:function(res){
                      _this.setData({
                        reLogin:true,
                        js_code:res.code
                      })
                    }
                  })
                }
              },
              fail:function(res){
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '请重新登录',
                  icon:"error",
                  duration:2000
                })
                wx.login({
                  success:function(res){
                    _this.setData({
                      reLogin:true,
                      js_code:res.code
                    })
                  }
                })
              }
            })
          },
          fail () {
            console.log("hello")
            wx.showModal({
              showCancel:false,
              content:"会话密钥过期，请重新登录"
            })
            wx.removeStorage({
              key: 'userid',
              success:function(res){
                console.log("数据清除成功")
              },
              fail:function(res){
                console.log("数据清除失败")
              }
            })
            console.log("enter2")
            // session_key 已经失效，需要重新执行登录流程
            wx.login({
              success:function(res){
                wx.hideLoading()
                wx.showToast({
                  title: '请重新登录',
                  duration:2000
                })
                _this.setData({
                  reLogin:true,
                  js_code:res.code
                })
              },fail(res){
                wx.showToast({
                  title: '系统错误',
                  duration:2000
                })
              }
            }) //重新登录
          }
        })
      },2000)
    },
    onLoad:function(){
      let _this=this
      wx.getStorage({
        key:"openid",
        success:function(res){
          if(res.data){
            console.log("shouyedenglu",res.data)
            wx.showToast({
              title: '登录成功',
              duration:2000
            })
            global.setOpenid(res.data)
            _this.setData({
              openid:res.data,
              login:true
            })
            _this.setIndexData()
            global.setLogin(true)
          }
        },
        fail:function(){
            _this.getUserAndStart()
        }
      })
    },
    setIndexData:function(){
      let _this=this
      wx.request({
        url: 'http://localhost:8081/small/v1/exesData?openid='+this.data.openid,//'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%E5%B0%8F%E7%A8%8B%E5%BA%8F&oq=%25E5%25B0%258F%25E7%25A8%258B%25E5%25BA%258Fonready&rsv_pq=d9a01947000036fb&rsv_t=b2eb5OVx2NazYRYv5L%2BKseVrf%2BjQmZjuMVuu7Cy7ZWlVyQj0juZYP9rCvU4&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=1144&rsv_sug3=24&rsv_sug1=12&rsv_sug7=100&rsv_sug2=0&rsv_sug4=1145&rsv_sug=2',
        success(res){
          console.log(res.data,Object.prototype.toString.call(_this.data.openid))
          let data=res.data
          time=data["times"]
          distance=data["dis"]
          for(let i in distance){
            distance[i]=distance[i]/1000
          }
          let ka=data["kaluli"]
          let date=new Date()
          dates=[]
          for(let i=time.length-1;i>-1;i--){
            date.setDate(date.getDate()-1)
            dates.push(date.getDate())
          }
          dates.reverse()
          dis=0
          times=time.length
          for(let i in distance){
            dis+=distance[i]
          }
          console.log(dis)
          dis=dis.toFixed(3)*1
          kaluli=0
          for(let i of ka){
            kaluli+=i
          }
          console.log(dis,times,kaluli,rank)
          _this.setData({
            distance:dis,
            times:times,
            kaluli:kaluli,
            rank:rank,
            login:true,
            dates:dates,
            time:time,
            distance_len:distance
          })
          global.setLogin(true)
          setTimeout(()=>{
            option = {
              title: {
                text: '七日运动量',
                left: 'center'
              },
              color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
              legend: {
                data: ["时间"],
                top: 30,
                left: 'center',
                backgroundColor: 'transparent',
                z: 100
              },
              grid: {
                containLabel: true
              },
              tooltip: {
                show: true,
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _this.data.dates,
                // show: false
              },
              yAxis: {
                x: 'center',
                type: 'value',
                splitLine: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
                // show: false
              },
              series: [{
                name: '时间',
                type: 'line',
                smooth: true,
                data: _this.data.time
                  }]
            } 
            option_dis = {
              color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
              legend: {
                data: ["距离"],
                top: 30,
                left: 'center',
                backgroundColor: 'transparent',
                z: 100
              },
              grid: {
                containLabel: true
              },
              tooltip: {
                show: true,
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: _this.data.dates,
                // show: false
              },
              yAxis: {
                x: 'center',
                type: 'value',
                splitLine: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
                // show: false
              },
              series: [{
                name: '距离',
                type: 'line',
                smooth: true,
                data: _this.data.distance_len
              }]
            } 
            console.log('chart',chart_1,_this.data.distance_len,_this.data.dates)
            console.log(distance)
            chart_1.setOption(option)
            chart_2.setOption(option_dis)
          },3000)
        }
      })
    },
    onShow:function(){
      let _this=this
      if(!this.data.login){
        this.login()
      }
          wx.switchTab({
            url: '../home/home',
          })
          //console.log(this.data.distance,this.data.times,this.data.kaluli,this.data.rank)
    },
    checkUser:function(openid){

    },
    getUserAndStart:function(){
      let _this=this
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res_info) => {
          /*this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })*/
          wx.hideLoading()
          console.log(_this.data.js_code,"code",res_info.userInfo.avatarUrl)
          wx.request({
            url: 'http://localhost:8081/small/v1/getCodeSession?js_code='+this.data.js_code,//'https://api.weixin.qq.com/sns/jscode2session?appid=wx7ab2e94ff1893395&secret=1854955c76e89fe661491223f33ddae4&js_code='+this.data.js_code+'&grant_type=authorization_code',
            success:function(res){
              let openid=res.data.openid
              console.log("user id",openid,res.data)
                wx.request({
                url: 'http://localhost:8081/small/v1/checkUser?openid='+openid,
                success:function(resq){
                  console.log(res,"login")
                  wx.setStorage({
                    key:"openid",
                    value:openid
                  })
                  if(resq.data=="success"){
                    wx.showToast({
                      title: '登录成功',
                      duration:2000
                    })
                    global.setOpenid(openid)
                    wx.setStorage({
                      key:"userid",
                      data:openid
                    })
                    wx.setStorage({
                      key:"userImage",
                      data:res_info.userInfo.avatarUrl
                    })
                    _this.setIndexData()
                    _this.setData({
                      openid:openid,
                      login:true
                    })
                    global.setLogin(true)
                  }
                  else if(resq.data=="info_error"){
                    wx.setStorage({
                      key:"userid",
                      data:openid
                    })
                    global.setOpenid(res.data)
                    global.setLogin(true)
                    wx.navigateTo({
                      url: '../setInfo/setInfo',
                    })
                  }
                  else{
                    wx.showToast({
                      title: '登录失败',
                      duration:2000
                    })
                  }
                },fail:function(resq){
                  wx.showToast({
                    title: '服务繁忙',
                    icon:"error",
                    duration:2000
                  })
                }
                })
            }
          })

        },fail:function(res){
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '系统错误',
                icon:"error",
                duration:2000
              })
            },
          })
          console.error("error",res)
        }
      })
    },
    toMoring:function(){
            wx.navigateTo({
                url: "../moringRun/moringRun",
              })
    },
    toRuning:function(){
      wx.navigateTo({
        url: "../planRun/planRun",
      })
    },
    toPoint:function(){
      wx.navigateTo({
        url: '../point/point',
      })
    },
    toGraft:function(){},
    toMine:function(){},
    toSetting:function(){},
})