// pages/point/point.js
import * as echarts from '../../utils/echart/ec-canvas/echarts';
var global=require("../global.js")
function inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) {
        return i;
      }
    }
    return -1;
  }
  // ArrayBuffer转16进度字符串示例
  function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  }
  var option = {
    color: ["#FFD600","#81c874"],
    series: [{
      name: '时间占比',
      type: 'pie',
      radius:'55%',
      smooth: true,
      data: [
          {"value":0},
          {"value":360}
      ],
      label:{
          show:false
      }
    }]
  } 
  let chartIn;
  function initChart(canvas,width,height){
const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  chartIn=chart
    canvas.setChart(chart);
    chart.setOption(option);
    return chart;
  }
Page({

    /**
     * 页面的初始数据
     */
    data: {
        devicelist:[{"name":"设备"}],
        searchingRotateAngle:0,
        searchingInter:null,
        remaiderString: '等待连接',
        connectionEquipment: '请先打开手机蓝牙，等待连接分析仪',
        isBloothOpen: 10,
        isConnected: 10,
        isFirestShow: false,
        devices: [],
        nowde:"",
        conInner:null,
        connected: false,
        chs: [],
        ec:{
            onInit:initChart
        },
        sec:0,
        min:0,
        showStart:0,
        startText:"开始计时",
        startInter:null,
        successScale:0.1,
        successLeft:0,
        finishSuccess:false,
        statusText:"",
        startable:true,
        setInter:null,//写入计时器
        hideInter:null,//后台刷新计时器
        lat:31.03242,
        lon:121.22655,
        status:0//0未开始,1进行中,2暂停,3结束
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
      if(this.data.hideInter){
        clearInterval(this.data.hideInter)
      }
      let _this=this  
      let date=new Date()
      let day=date.getDay()
      let time=date.getTime()
      wx.getStorage({
        key:"point_data",
        success:function(res){
          if(res.data.day==day){//同一天进入
            let storgeTime=res.data.time*1
            if((time-storgeTime)<900000){//900000 15分钟有效
              wx.showModal({
                showCancel:false,
                content:"暂停有效期内，可继续打卡"
              })
              _this.setData({
                min:res.data.min,
                sec:res.data.sec
              })
            }
            else{
              wx.showModal({
                showCancel:false,
                content:"已超出暂停有效期时长，请重新计时"
              })
            }
          }
        }
      })
      wx.request({
        url: 'http://localhost:8081/small/v1/pointAvaliable?openid='+global.getOpenid(),
        success:function(res){
          if(res.data=="success"){
            let a=280,b=80
            /*setInterval(()=>{
                a-=10
                b+=10
                option = {
                    animation:true,
                    animationDuration:1000,
                    color: ["#FFD600","#81c874"],
                    series: [{
                      name: '时间占比',
                      type: 'pie',
                      radius:'55%',
                      smooth: true,
                      data: [
                          {"value":b},
                          {"value":a}
                      ],
                      label:{
                          show:false
                      }
                    }]
                  } 
                  chartIn.setOption(option)
                  this.setData({
                      ec:{
                          onInit:initChart
                      }
                  })
            },1000)*/
            /*let inter=setInterval(()=>{
                let nowAngle=_this.data.searchingRotateAngle
                nowAngle+=60
                _this.setData({
                    searchingRotateAngle:nowAngle
                })
            },500)
            if(_this.data.searchingInter==null){
                _this.setData({
                    searchingInter:inter
                })
            }*/
            //_this.openBluetoothAdapter()
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
    openBluetoothAdapter() {
        /*wx.showLoading({
          title: '正在刷新',
          duration:10000
        })*/
        let inn=setTimeout(()=>{
            wx.hideLoading()
        },10000)
        this.setData({
            conInner:inn
        })
        wx.openBluetoothAdapter({
          success: (res) => {
            this._discoveryStarted=false
            console.log('openBluetoothAdapter success', res)
            this.startBluetoothDevicesDiscovery()

          },
          fail: (res) => { 
            if (res.errCode === 10001) {
              wx.onBluetoothAdapterStateChange(function (res) {
                wx.hideLoading()
                console.log('onBluetoothAdapterStateChange', res)
                if (res.available) {
                  this.startBluetoothDevicesDiscovery()
                }
              })
            }
          }
        })

      },
      getBluetoothAdapterState() {
        wx.getBluetoothAdapterState({
          success: (res) => {
            console.log('getBluetoothAdapterState', res)
            if (res.discovering) {
              this.onBluetoothDeviceFound()
            } else if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          }
        })
      },
      startBluetoothDevicesDiscovery() {
        if (this._discoveryStarted) {
            console.log("out")
          return
        }
        this._discoveryStarted = true
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: true,
          success: (res) => {
            console.log('startBluetoothDevicesDiscovery success', res)
            this.onBluetoothDeviceFound()
          },
        })
      },
      stopBluetoothDevicesDiscovery() {
        wx.stopBluetoothDevicesDiscovery()
      },
      onBluetoothDeviceFound() {
        wx.onBluetoothDeviceFound((res) => {
            
        let names=[]
        for(let i in res.devices){
            names.push({"name":res.devices[i].name,"id":res.devices[i].deviceId})
        }
        clearTimeout(this.data.conInner)
        this.setData({
            devicelist:names,
            conInner:null
        })

        wx.hideLoading()
          res.devices.forEach(device => {
            if (!device.name && !device.localName) {
              return
            }
            console.log(device.name,device.localName,"find")
            const foundDevices = this.data.devices
            const idx = inArray(foundDevices, 'deviceId', device.deviceId)
            const data = {}
            if (idx === -1) {
              data[`devices[${foundDevices.length}]`] = device
            } else {
              data[`devices[${idx}]`] = device
            }
            this.setData(data)
          })
          this.stopBluetoothDevicesDiscovery()
        })
      },
      createBLEConnection(e) {
        const ds = e.currentTarget.dataset
        const deviceId = ds.deviceId
        const name = ds.name
        console.log("链接",deviceId)//D0DC87C1-4AF0-14BA-A39D-640373CC4051
        wx.createBLEConnection({
          deviceId,
          success: (res) => {
            wx.showToast({
                title: '链接成功',
                duration:2000
              })
              this.setData({
                nowde:deviceId,
              })
              if(deviceId=="D0DC87C1-4AF0-14BA-A39D-640373CC4051"){
                this.setData({
                    connected: true,
                    //name,
                    showStart:0,
                    startText:"停止计时",
                    status:1,
                    deviceId,
                  })
                  this.getBLEDeviceServices(deviceId)
              }else{
                  let that=this
                  setTimeout(()=>{
                    wx.showModal({
                        showCancel:false,
                        title:"该设备非打卡设备,已自动断开",
                        success:(r)=>{
                          that.closeBLEConnection(deviceId)
                        }
                    })
                  },2000)
              }
          }
        })
        this.stopBluetoothDevicesDiscovery()
      },
      closeBLEConnection(id) {
        wx.closeBLEConnection({
          deviceId: id //this.data.deviceId

        })
        wx.showToast({
          title: '链接断开',
          icon:"error",
          duration:2000
        })
        this.setData({
          connected: false,
          chs: [],
          nowde:"",
          canWrite: false,
        })
      },
      getBLEDeviceServices(deviceId) {
        wx.getBLEDeviceServices({
          deviceId,
          success: (res) => {
            console.log("server",res)
            for (let i = 0; i < res.services.length; i++) {
              if (res.services[i].isPrimary) {
                this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
                return
              }
            }
          }
        })
      },
      getBLEDeviceCharacteristics(deviceId, serviceId) {
        wx.getBLEDeviceCharacteristics({
          deviceId,
          serviceId,
          success: (res) => {
            console.log('getBLEDeviceCharacteristics success', res.characteristics)
            for (let i = 0; i < res.characteristics.length; i++) {
              let item = res.characteristics[i]
              if (item.properties.read) {
                wx.readBLECharacteristicValue({
                  deviceId,
                  serviceId,
                  characteristicId: item.uuid,
                })
              }
              if (item.properties.write) {
                this.setData({
                  canWrite: true
                })
                this._deviceId = deviceId
                this._serviceId = serviceId
                this._characteristicId = item.uuid
                this.writeBLECharacteristicValue()
              }
              if (item.properties.notify || item.properties.indicate) {
                wx.notifyBLECharacteristicValueChange({
                  deviceId,
                  serviceId,
                  characteristicId: item.uuid,
                  state: true,
                })
              }
            }
          },
          fail(res) {
            console.error('getBLEDeviceCharacteristics', res)
          }
        })
        // 操作之前先监听，保证第一时间获取数据
        wx.onBLECharacteristicValueChange((characteristic) => {
          const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
          const data = {}
          if (idx === -1) {
            data[`chs[${this.data.chs.length}]`] = {
              uuid: characteristic.characteristicId,
              value: ab2hex(characteristic.value)
            }
          } else {
            data[`chs[${idx}]`] = {
              uuid: characteristic.characteristicId,
              value: ab2hex(characteristic.value)
            }
          }
          // data[`chs[${this.data.chs.length}]`] = {
          //   uuid: characteristic.characteristicId,
          //   value: ab2hex(characteristic.value)
          // }
          this.setData(data)
        })
      },
      writeBLECharacteristicValue() {
        // 向蓝牙设备发送一个0x00的16进制数据
        let buffer = new ArrayBuffer(1)
        let dataView = new DataView(buffer)
        dataView.setUint8(0, Math.random() * 255 | 0)
        wx.writeBLECharacteristicValue({
          deviceId: this._deviceId,
          serviceId: this._serviceId,
          characteristicId: this._characteristicId,
          value: buffer,
        })
      },
      closeBluetoothAdapter() {
        wx.closeBluetoothAdapter()
        this._discoveryStarted = false
      },
      getTheBlueDisConnectWithAccident:function(e){
        var that = this;
        wx.onBLEConnectionStateChange(function (res) {
          console.log(res)
          if (!res.connected){
          wx.closeBluetoothAdapter({
            success: function(res) {
                that.closeBluetoothAdapter()
                wx.showToast({
                  title: '链接断开',
                  duration:2000
                })
              wx.openBluetoothAdapter({
               success: function(res) {
                },
              })
            },
          })
            that.setData({
              //showBacGroundImageView: '../../images/button_bg_disabled@2x.png',//背景图片
              remaiderString: "等待连接",
              ishindden: true,
              isSugarHidden: true,
              isConnected: 10,
              isFirestShow: false,
              testResultIndex: 0,
            })
            //that.countdown()//开启计时
          } 
        })
      },// 倒计时
      countdown: function() {
        var that = this;
        that.initBlue(that);          //这步很重要，没有这步，重复点击会出现多个定时器
        var time = that.data.time;
        console.log("倒计时开始")
        var interval = setInterval(function () {
          time--;
          that.setData({
            time: time
          })
          if (time == 0) {          //归0时回到60
              var countId = that.data.isConnected;
              if(countId == 10){
                that.restartTap();
                that.findBlue()
              }
              if(countId == 20){
                that.clearTimeInterval()
              }
          }
        }, 1000)
        that.setData({
          interval: interval
        })
      },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      let hideInter=setInterval(()=>{
        wx.setStorage({
          key:"keep",
          data:{"string":"keep-alive"}
        })
      },1000)
      this.setData({
        hideInter
      })
    },
    connectBlo:function(){
        let _this=this
        wx.onBluetoothDeviceFound((result) => {
            _this.setData({
                devicelist:result.devices
            })
            console.log(result.devices)
            wx.stopBluetoothDevicesDiscovery()
            for(let i in result.devices){
                if(result.devices[i].connectable){
                    console.log(_this.connectAct(result.devices[i].deviceId))
                }
            }
        })
        wx.getBluetoothAdapterState({
            mode:"central",
          success: (result) => {
              wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: true,
                success:(res)=>{
                    console.log(res)
                }
              })
          },  
          fail: (res) => {
              console.error("错误",res)
            if (res.errCode !== 10001) return
            wx.onBluetoothAdapterStateChange((res) => {
              if (!res.available) return
              // 开始搜寻附近的蓝牙外围设备
              wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: false,
              })
            })
          }
        })
    },
    connectAct:function(deviceId){
        wx.createBLEConnection({
            deviceId,
            success:()=>{
                wx.getBLEDeviceServices({
                  deviceId,
                  success:(res)=>{
                      for (let i = 0; i < res.services.length; i++) {
                          if (res.services[i].connectable) {
                            console.log("link",res.services[i])
                          }
                        }
                  }
                })
            }
          })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(this.data.searchingInter)     
        clearInterval(this.data.startInter)
        clearInterval(this.data.setInter)
        this.setSto()
        this.setData({
          status:2,
          startInter:null,
          setInter:null
        })
    },
    setSto:function(){
      let date=new Date()
      console.log("day",date.getDay())
      wx.setStorage({
        key:"point_data",
        data:{
          "min":this.data.min,
          "sec":this.data.sec,
          "time":date.getTime(),
          "day":date.getDay()
        }
      })
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
    start:function(type=0){
      let targetPoint={//打卡点坐标
        lat:31.03242,
        lon:121.22655
      }
      let _this=this
        if(_this.data.status==0 || _this.data.status==2){
          wx.getLocation({
            type: 'wgs84',
            success (res) {
            const latitude = _this.data.lat
            const longitude = _this.data.lon
            if(Math.abs(targetPoint.lat-latitude)<0.00003 && Math.abs(targetPoint.lon-longitude)<0.00003){
            _this.setData({
              startText:"停止计时",
              status:1
            })
                let angle=0
                let inter=setInterval(()=>{
                    let sec=_this.data.sec,min=_this.data.min
                    sec+=1
                    if(sec>=60){
                        sec=1
                        min+=1
                    }
                    _this.setData({
                        sec:sec,
                        min:min
                    })
                    angle=((min*60)+sec)/5
                    console.log(angle)
                    let radius="55%"
                    if(angle>=360){//打卡完成
                      _this.setData({
                        sec:0,
                        min:30
                    })
                      radius="0"
                      clearInterval(inter)
                      _this.setData({
                        startInter:null,
                        successScale:1,
                        setInter:null
                      })
                      setTimeout(()=>{
                        _this.setData({
                          successLeft:100,
                          finishSuccess:true,
                          startText:"打卡结束",
                          statusText:"本次打卡已完成"
                        })
                      },500)
                      /*发送记录请求
                      wx.request({
                        url: 'http://url/small/v1/recordPoint?userId=userid',
                      })*/
                      wx.showToast({
                        title: '打卡完成',
                        duration:1000
                      })
                      wx.showToast({
                        title: '正在记录',
                        duration:1000
                      })
                      setTimeout(()=>{
                        wx.request({
                          url: 'http://localhost:8081/small/v1/record?openid='+global.getOpenid()+"&time=30&type=point",
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
                      },3000)
        
                    }
                    option = {
                        animation:true,
                        animationDuration:1000,
                        color: ["#FFD600","#81c874"],
                        series: [{
                          name: '时间占比',
                          type: 'pie',
                          radius:radius,
                          smooth: true,
                          data: [
                              {"value":angle},
                              {"value":360-angle}
                          ],
                          label:{
                              show:false
                          }
                        }]
                      } 
                      chartIn.setOption(option)
                    
                },1000)
                let setInter=setInterval(()=>{
                  wx.getLocation({
                    type: 'wgs84',
                    success (res) {
                    const latitude = _this.data.lat
                    const longitude = _this.data.lon
                  if(Math.abs(targetPoint.lat-latitude)>0.00003 || Math.abs(targetPoint.lon-longitude)>0.00003){
                    wx.showModal({
                      showCancel:false,
                      content:"离开打卡有效区，已暂停打卡",
                      success:function(res){
                        wx.navigateBack({
                          delta: 1,
                        })
                      }
                    })

                    _this.pause()
                  }}})
                  _this.setSto()
                },5000)
                if(_this.data.startInter==null){
                  _this.setData({
                    startInter:inter,
                    setInter
                  })
                }
            }else{
            wx.showModal({
              showCancel:false,
              content:"未处于打卡有效区内",
              success:function(){
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          }
          }})

        }
        else if(_this.data.status==1){
          console.log("pasu")
            wx.showModal({
              cancelColor: '#81c874',
              cancelText:"继续打卡",
              content:"暂停后，十五分钟内未恢复将清零本次已计时长",
              success:(res)=>{
                if(res.confirm){
                  _this.pause()
                  wx.navigateBack({
                    delta: 1,
                  })
                }
    
              }
            })

        }
    },
    pause:function(){
      let _this=this
      clearInterval(_this.data.startInter)
      clearInterval(_this.data.setInter)
      _this.setData({
        status:2,//暂停状态
        startText:"开始计时",
        startInter:null,
        setInter:null
      })
    },
    end:function(type=0){
      clearInterval(this.data.startInter)
      clearInterval(this.data.setInter)
      this.setData({
        status:2,
        startInter:null,
        setInter:null
      })
      let _this=this
      if(type==0){
        wx.showModal({
          cancelColor: 'red',
          cancelText:"确认结束",
          confirmText:"继续打卡",
          content:"确认结束此次打卡?",
          success:(res)=>{
            if(res.confirm){
              wx.showToast({
                title: '打卡继续',
                duration:1000
              })
              _this.start()
            }
            else{
              if(_this.data.min<30){
                if(type==0){
                  wx.showModal({
                    cancelColor: 'red',
                    cancelText:"取消",
                    confirmText:"确认结束",
                    content:"本次打卡未达到要求，结束将不记录",
                    success:(res_1)=>{
                      if(res_1.confirm){
                        wx.showToast({
                          title: '打卡结束',
                          duration:2000
                        })
                        setTimeout(()=>{
                          wx.navigateBack({
                            delta: 1,
                          })
                        },2000)
                      }else{
                        _this.start()
                      }
                    }
                  })
                }
              }else{
                wx.showToast({
                  title: '打卡完成',
                  duration:2000
                })
                wx.request({
                  url: 'http://localhost:8081/small/v1/record?openid='+global.getOpenid()+"&time=30&type=point",
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
              }
            }
          }
        })
      }

    }
})