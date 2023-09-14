from django.http import HttpResponse
import json
import sqlite3
import datetime
import random
import requests
hasSet=False
#C:\Users\Administrator\Desktop\data.sqlite3
connect = sqlite3.connect(r"D:\Junior2\软件课设\东华IRUN代码\源程序或源文件\control\data.sqlite3", check_same_thread=False)
def getCodeSession(request):
    js_code=request.GET["js_code"]
    url='https://api.weixin.qq.com/sns/jscode2session?appid=wx05f1c9c2e9cb4d59&secret=41e19cef4ad13d6797be1bf5201cddc3&js_code='+js_code+'&grant_type=authorization_code'
    get=requests.get(url)
    print("getrequest",get.text)
    return HttpResponse(get.text)
def getExesData(request):
    openid=request.GET["openid"]
    # check_same_thread=False作用是允许异步操作，必须设置，否则数据量多的时候会直接报错
    SQL = "SELECT exdata FROM studentInfo WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()  # 获取游标，用于查询
    result = cursor.execute(SQL).fetchall()  # execute为执行语句，还要再加上fetchall才能匹配数据，否则没有数据返回
    print("result",result)
    try:
        if result[0][0]:
            reData=json.loads(result[0][0])
            print(reData, "indexData")
            times = []
            dis = []
            ka=[]
            idex = 0
            for item in reData:
                if idex>=7:
                    break
                if item["time"]!=0:
                    times.append(item['time'])
                    ka.append(random.randint(1000,3000))
                else:
                    times.append(0)
                idex += 1
            idex=0
            for item in reData:
                if idex >= 7:
                    break
                if item["dis"] != 0:
                    dis.append(item['dis'])
                    ka.append(random.randint(1000,3000))
                else:
                    dis.append(0)
                idex += 1
            result=json.dumps({
            "times":times,
            "dis":dis,
            "kaluli":ka})
            print("outLie",result)
        else:
            result = json.dumps({
                "times": [],
                "dis": [],
                "kaluli": []})
    except:
        result = json.dumps({
            "times": [],
            "dis": [],
            "kaluli": []})

    return HttpResponse(result)
def getPeopleRank(request):
    '''people=1500#参与人数
    rank=1#请求用户在所有人数中的排名
    data=json.dumps({
        "people":people,
        "rank":rank
    })
    return HttpResponse(data)'''
def checkUser(request):#**
    openid = request.GET["openid"]
    # 若用户openid不存在，则新增该openid，并返回文本info_error
    SQL1 = "SELECT openid FROM studentInfo WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()
    result_openid = cursor.execute(SQL1).fetchall()
    if not result_openid:  # openid不存在，向studentInfo中添加记录
        SQL2 = "INSERT INTO studentInfo (openid) VALUES ('{}')".format(openid)  # 不用给其他列添加
        cursor.execute(SQL2)
        connect.commit()
        return HttpResponse("info_error")
    else:
        # openid存在
        SQL3 = "SELECT name,number,schoolId FROM studentInfo WHERE openid='{}'".format(openid)
        cursor = connect.cursor()
        result_info = cursor.execute(SQL3).fetchall()
        info = result_info

        if info[0][0] and info[0][1] and info[0][2]:  # 姓名，学号，学校代码都存在
            return HttpResponse("success")
        else:  # 姓名、学号、学校三个信息任意一个不存在
            return HttpResponse("info_error")

    #try:
    #    if openid in usersData:
    #        return HttpResponse("success")
    #    else:
    #        #openid不存在则新增
    #        return HttpResponse("success")
    #except:
    #    return HttpResponse("error")
def record(request):
    data = request
    openid = data.GET["openid"]
    time = data.GET["time"]
    type1 = data.GET["type"]
    dis = 0
    if type1 == "run":
        dis = data.GET["dis"]
        type1=0
    else:
        type1=1
    # 分别从today.term.studentInfo三个数据表中都取出openid对应的exdata列数据
    SQL_today = "SELECT exdata FROM today WHERE openid='{}'".format(openid)
    SQL_term = "SELECT exdata FROM term WHERE openid='{}'".format(openid)
    SQL_studentInfo = "SELECT exdata FROM studentInfo WHERE openid='{}'".format(openid)

    # 执行today.term.studentInfo三个数据表的SQL语句
    cursor = connect.cursor()
    result_today = cursor.execute(SQL_today).fetchall()
    result_term = cursor.execute(SQL_term).fetchall()
    result_studentInfo = cursor.execute(SQL_studentInfo).fetchall()

    # 对数据库中数据进行反序列化
    try:
        if result_today[0][0]:
            exdata_today = json.loads(result_today[0][0])
        else:
            exdata_today=[]
        if result_term[0][0]:
            exdata_term = json.loads(result_term[0][0])
        else:
            exdata_term=[]
        if result_studentInfo[0][0]:
            print("result_studentInfo",result_studentInfo)
            exdata_studentInfo = json.loads(result_studentInfo[0][0])
        else:
            exdata_studentInfo=[]
    except:
        exdata_today=[]
        exdata_term=[]
        exdata_studentInfo=[]
    # 计算卡路里calorie(随机值)
    calorie = random.randint(10, 500)

    # 获取当前时间date
    date = datetime.datetime.now().strftime('%Y-%m-%d')

    new_exdata = {
            "date": date,
            "time": time,
            "dis": dis,
            "calorie": calorie,
        }
    try:
        if not exdata_today:  #today表中无openid对应的exdata
            exdata = json.dumps(new_exdata)
            SQL = "INSERT INTO today(exdata,openid) VALUES('{}', '{}')".format(exdata, openid)
            cursor.execute(SQL)
            connect.commit()

            SQL = "SELECT * FROM sevenDay WHERE date='{}'".format(data)
            result=cursor.execute(SQL).fetchall()[0][0]
            if result:
                SQL="UPDATE sevenDay SET number=number+1 WHERE date='{}' AND type = {}".format(data,type1)
            else:
                SQL = "INSERT INTO sevenDat(date,type,number)  VALUES ('{}',{},1)".format(data, type1)
            cursor.execute(SQL)
            connect.commit()

            exdata_term.append(new_exdata)
            exdata = json.dumps(exdata_term)
            SQL = "UPDATE term SET exdata='{}' WHERE openid='{}'".format(exdata, openid)
            cursor.execute(SQL)
            connect.commit()

            exdata_studentInfo.append(new_exdata)
            exdata = json.dumps(exdata_studentInfo)
            SQL = "UPDATE studentInfo SET exdata='{}' WHERE openid='{}'".format(exdata, openid)
            cursor.execute(SQL)
            connect.commit()
        else:
            return HttpResponse("error")

        return HttpResponse("success")

    except Exception as e:
        print("errpr",e)
        SQL_error = "SELECT exdata FROM errorData WHERE openid='{}'".format(openid)
        result_error = cursor.execute(SQL_error)
        exdata_error = json.loads(result_error)
        if not exdata_error:  # errorData表中无openid对应的exdata
            exdata = json.dumps(new_exdata)
            SQL = "INSERT INTO errorData(exdata, openid) VALUES('{}', '{}')".format(exdata, openid)
            cursor.execute(SQL)
            connect.commit()
        else:
            exdata_error.append(new_exdata)
            exdata = json.dumps(exdata_error)
            SQL = "UPDATE errorData SET exdata='{}' WHERE openid='{}'".format(exdata, openid)
            cursor.execute(SQL)
            connect.commit()
        return HttpResponse("error")
    #按照openid记录此次锻炼时间(ex_time)、运动距离(ex_dis)
def pointAvaliable(request):
    data = request
    openid = data.GET["openid"]

    SQL = "SELECT exdata FROM today WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()
    result = cursor.execute(SQL).fetchall()

    if not result:  # result为空，说明不存在运动记录，今日未打卡
        return HttpResponse("success")
    else:
        return HttpResponse("recorded")
def getUserInfo(request):

    data = request
    openid = data.GET["openid"]

    # 获取主要信息
    SQL_main = "SELECT name,number,schoolId FROM studentInfo WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()
    result_main = cursor.execute(SQL_main).fetchall()

    # # 获取次要信息
    # SQL_other = "SELECT nickname, college, gender, height, weight FROM studentInfo WHERE openid = '{}'".format(openid)
    # result_other = cursor.execute(SQL_other).fetchall()

    # 获取学校名
    SQL_schoolName = "SELECT schoolName FROM schoolData WHERE schoolId = '{}'".format(result_main[0][2])
    schoolName = cursor.execute(SQL_schoolName).fetchall()[0][0]

    # 获取运动记录
    SQL_exdata = "SELECT exdata FROM term WHERE openid = '{}'".format(openid)
    exdata = cursor.execute(SQL_exdata).fetchall()
    if not exdata:
        exdata=[]
    else:
        print("getEx",exdata[0][0])
        exdata=json.loads(exdata[0][0])
    info = {
            "name": result_main[0][0],
            "number": result_main[0][1],
            "school": schoolName,
            "userInfo": [{}],  # 次要信息暂不获取
            "ex_record": exdata
        }
    print(info)
    # 返回序列化后的信息
    info1 = json.dumps(info)
    return HttpResponse(info1)
def setInfo(request):
    data = request
    openid = data.GET["openid"]
    name = data.GET["name"]  # 学生姓名
    number = data.GET["number"]  # 学生学号
    schoolId = data.GET["school"]  # 学校代码

    # 获取学校名
    # SQL_schoolName = "SELECT schoolName FROM schoolData WHERE schoolId = '{}'".format(schoolId)
    #
    # schoolName = cursor.execute(SQL_schoolName).fetchall()

    # 更新studentInfo
    try:
        SQL = "UPDATE studentInfo SET name='{}',number={},schoolId={} WHERE openid='{}'".format(name, number, schoolId,
                                                                               openid)
        cursor = connect.cursor()
        cursor.execute(SQL)
        connect.commit()
        return HttpResponse("success")
    except:
        return HttpResponse("error")
def getPoint(request):
    openid=request.GET["openid"]
    SQL_main = "SELECT schoolId FROM studentInfo WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()
    result_main = cursor.execute(SQL_main).fetchall()
    schoolId = result_main[0][0]
    SQL = "SELECT points FROM schoolData WHERE schoolId = {}".format(schoolId)
    cursor = connect.cursor()
    result = cursor.execute(SQL).fetchall()
    try:
        if result[0][0]:
            return HttpResponse(result[0][0])
        else:
            return HttpResponse("[]")
    except:
        return HttpResponse("[]")
def getSchoolList(request):


    # 获取学校代码和学校名
    SQL_school = "SELECT schoolId, schoolName FROM schoolData"
    cursor = connect.cursor()
    school = cursor.execute(SQL_school).fetchall()

    school_list = []
    for i in school:
        dic = {"number": i[0], "name": i[1]}
        school_list.append(dic)
    #school_list = json.dumps(school_list)
    school_list={"schoolList":school_list}
    print("school",school_list)
    return HttpResponse(json.dumps(school_list))