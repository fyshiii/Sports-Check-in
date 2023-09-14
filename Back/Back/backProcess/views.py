from django.shortcuts import render
import json
from django.http import HttpResponse
from pathlib import Path
import sqlite3
from datetime import date, timedelta,datetime

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
#C:\Users\Administrator\Desktop\data.sqlite3
connect=sqlite3.connect(r"D:\Junior2\软件课设\东华IRUN代码\源程序或源文件\control\data.sqlite3",check_same_thread=False)
# Create your views here.
def login(request):

    data=request.body.decode("utf-8")
    data=json.loads(data)
    username=data["username"]
    password=data["password"]
    userInfo={
        "12345":{"password":"12345","role":"teacher"},
        "123456":{"password":"123456","role":"manager"}
    }
    SQL="SELECT password,role FROM manager WHERE username='{}'".format(username)
    cursor=connect.cursor()

    try:
        result=cursor.execute(SQL).fetchall()[0]

        if password==result[0]:

            return HttpResponse(result[1])
        else :
            return HttpResponse("error")
    except:
        return HttpResponse("error")
def lockTeacher(request):
    '''teacherNumber=request.GET["username"]
    return HttpResponse("success")'''
    username = request.GET["username"]

    # 获取教师账号的状态 锁定/解锁
    SQL = "SELECT status FROM manager WHERE username = '{}'".format(username)
    cursor = connect.cursor()
    result = cursor.execute(SQL).fetchall()
    status = result[0][0]
    # 改变锁定状态
    try:
        date = datetime.now().strftime('%Y-%m-%d')
        name = "LOCK"
        number = request.headers['X-Forwarded-For']
        SQL = "INSERT INTO record(name,number,time,content) VALUES ('{}','{}','{}','{}')".format(name, number, date,
                                                                                                 "锁定/解锁教师账户")
        cursor.execute(SQL)
        connect.commit()
        if status is 1:
            SQL = "UPDATE manager SET status = 0 WHERE username = '{}'".format(username)
            cursor.execute(SQL)
            connect.commit()
            return HttpResponse("success")
        else:
            SQL = "UPDATE manager SET status = 1 WHERE username = '{}'".format(username)
            cursor.execute(SQL)
            connect.commit()
            return HttpResponse("success")
    except:
        return HttpResponse("error")
def getClass(request):
    #按照老师查找所有班级
    username = request.GET["username"]
    # 按username查找class
    SQL = "SELECT class FROM manager WHERE username = '{}'".format(username)
    cursor = connect.cursor()

    try:
        result = cursor.execute(SQL).fetchall()[0][0]
        data=[]
        result=result.replace("[","")
        result=result.replace("]","")
        result=result.split(",")
        print(result)
        for item in result:
            SQL="SELECT classNumber FROM class WHERE classId={}".format(int(item))
            num=cursor.execute(SQL).fetchall()[0][0]
            data.append({
                "number":item,
                "nums":num
            })
        print("class", data)
        return HttpResponse(json.dumps(data))
    except Exception as e:
        print(e)
        return HttpResponse("error")
def getclassList(request):
    #按照学校查找所有班级
    schoolId = request.GET["schoolid"]
    data = [{
        "number": 12345688,
        "nums": 50
    }]
    return HttpResponse(json.dumps(data))
def delTeacher(request):
    username = request.GET["username"]
    # 删除指定username的教师记录
    SQL = "DELETE FROM manager WHERE username = '{}'".format(username)
    cursor = connect.cursor()
    connect.commit()
    result = cursor.execute(SQL).fetchall()

    try:
        date = datetime.now().strftime('%Y-%m-%d')
        name = "DEL"
        number = request.headers['X-Forwarded-For']
        SQL = "INSERT INTO record(name,number,time,content) VALUES ('{}','{}','{}','{}')".format(name, number, date,
                                                                                                 "删除教师账户")
        cursor.execute(SQL)
        connect.commit()
        if result:
            return HttpResponse("success")
        else:
            return HttpResponse("error")
    except:
        return HttpResponse("error")
def getStudentData(request):

    openid = request.GET["openid"]

    # 查找学生本学期的运动记录
    SQL = "SELECT exdata FROM term WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()
    result = cursor.execute(SQL).fetchall()

    print("term",result)
    sportsData = []
    try:
        if result[0][0]:
            result=json.loads(result[0][0])
        else:
            result=[]
        print("data",result,type(result))
        for data in result:
            dis = data["dis"]
            if dis == '0':  # small中record函数规定，dis默认=0
                type1 = 1
            else:
                type1 = 0
            time = data["time"]
            dic = {
                "type": type1,
                "time": time,
                "dis": dis,
                "status": True
            }
            sportsData.append(dic)
    except Exception as e:
        print("errpr",e)
        sportsData=[]
    print("out er",sportsData)
    sportsData1 = json.dumps(sportsData)
    return HttpResponse(sportsData1)
def getStudentList(request):
    targetType=request.GET["type"]
    print("type",targetType,type(targetType))
    schoolId=""
    #按照学校，班级，教师查询

    if int(targetType)==0:#按学校查
        print("学校")
        schoolId=int(request.GET["schoolId"])
        cursor=connect.cursor()
        sql="SELECT * FROM studentInfo WHERE schoolId ={}".format(schoolId)
        cursor.execute(sql)
        returnData=cursor.fetchall()
        data = []
        for item in returnData:
            openid=item[1]#学生openid
            sql = "SELECT exdata FROM term WHERE openid ='{}'".format(openid)
            cursor.execute(sql)
            exData=cursor.fetchall()
            try:
                exData=json.loads(exData[0][0])
            except Exception as e:
                exData=[]
            times=len(exData)
            status=True if times>31 else False
            sql = "SELECT schoolName FROM schoolData WHERE schoolId ={}".format(schoolId)
            schoolName=cursor.execute(sql).fetchall()[0][0]
            data.append({
                    "username":item[-2],
                    "name":item[3],
                    "number":item[2],
                    "times":times,
                    "class": item[-3],
                    "schoolId": schoolId,
                    "schoolName": schoolName,
                    "openid":item[1],
                    "status":status,
                    "lock":item[-1]})
        return HttpResponse(json.dumps(data))
    elif int(targetType)==2:
        print("按班级查询")
        classNumber = request.GET["class"]
        cursor = connect.cursor()
        sql = "SELECT * FROM studentInfo WHERE class ={}".format(classNumber)
        cursor.execute(sql)
        returnData = cursor.fetchall()
        data = []
        for item in returnData:
            schoolId = item[4]
            openid = item[1]  # 学生openid
            sql = "SELECT exdata FROM term WHERE openid ='{}'".format(openid)
            cursor.execute(sql)
            exData = cursor.fetchall()
            try:
                exData = json.loads(exData[0][0])
            except Exception as e:
                exData = []
            times = len(exData)
            status = True if times > 31 else False
            sql = "SELECT schoolName FROM schoolData WHERE schoolId ={}".format(schoolId)
            schoolName = cursor.execute(sql).fetchall()[0][0]
            data.append({
                "username": item[-2],
                "name": item[3],
                "number": item[2],
                "times": times,
                "class": item[-3],
                "schoolId": schoolId,
                "schoolName": schoolName,
                "openid": item[1],
                "status": status,
                "lock": item[-1]})
        return HttpResponse(json.dumps(data))
    else:
        userName = ""
        userName=request.GET["username"]
        classNumber =0
        cursor = connect.cursor()
        sql = "SELECT class FROM manager WHERE username ='{}'".format(userName)
        cursor.execute(sql)
        classList = json.loads(cursor.fetchall()[0][0])
        data=[]
        for classNumber in classList:
            sql = "SELECT * FROM studentInfo WHERE class ={}".format(classNumber)
            cursor.execute(sql)
            returnData = cursor.fetchall()
            for item in returnData:
                schoolId = item[4]
                openid = item[1]  # 学生openid
                sql = "SELECT exdata FROM term WHERE openid ='{}'".format(openid)
                cursor.execute(sql)
                exData = cursor.fetchall()
                try:
                    exData = json.loads(exData[0][0])
                except Exception as e:
                    exData = []
                times = len(exData)
                status = True if times > 31 else False
                sql = "SELECT schoolName FROM schoolData WHERE schoolId ={}".format(schoolId)
                schoolName = cursor.execute(sql).fetchall()[0][0]
                data.append({
                    "username": item[-2],
                    "name": item[3],
                    "number": item[2],
                    "times": times,
                    "class": item[-3],
                    "schoolId": schoolId,
                    "schoolName": schoolName,
                    "openid": item[1],
                    "status": status,
                    "lock": item[-1]})
        return HttpResponse(json.dumps(data))
def lockStudent(request):
    openid = request.GET["openid"]

    SQL = "SELECT lock FROM studentInfo WHERE openid = '{}'".format(openid)
    cursor = connect.cursor()
    result = cursor.execute(SQL).fetchall()

    lock = result[0][0]
    print("lock",lock,type(lock))
    try:
        if lock == '1':
            SQL = "UPDATE studentInfo SET lock= 0 WHERE openid='{}'".format(openid)
            cursor.execute(SQL)
            connect.commit()

        elif lock == '0' or not lock:
            SQL = "UPDATE studentInfo SET lock= 1 WHERE openid='{}'".format(openid)
            cursor.execute(SQL)
            connect.commit()
        date = datetime.now().strftime('%Y-%m-%d')
        name = "LOCK"
        number = request.headers['X-Forwarded-For']
        SQL = "INSERT INTO record(name,number,time,content) VALUES ('{}','{}','{}','{}')".format(name, number, date,
                                                                                                 "锁定/解锁学生账户")
        cursor.execute(SQL)
        connect.commit()
        return HttpResponse("success")
    except:
        return HttpResponse("error")
def delStudent(request):
    '''openid=request.GET["openid"]
    return HttpResponse("success")'''
    openid = request.GET["openid"]
    cursor = connect.cursor()
    try:
        SQL_studentInfo = "DELETE FROM studentInfo WHERE openid = '{}'".format(openid)
        cursor.execute(SQL_studentInfo)
        connect.commit()

        SQL_term = "DELETE FROM term WHERE openid = '{}'".format(openid)
        cursor.execute(SQL_term)
        connect.commit()

        SQL_today = "DELETE FROM today WHERE openid = '{}'".format(openid)
        cursor.execute(SQL_today)
        connect.commit()
        date = datetime.now().strftime('%Y-%m-%d')
        name = "DEL"
        number = request.headers['X-Forwarded-For']
        SQL = "INSERT INTO record(name,number,time,content) VALUES ('{}','{}','{}','{}')".format(name, number, date,
                                                                                                 "删除学生账户")
        cursor.execute(SQL)
        connect.commit()
    except:
        return HttpResponse("error")
    return HttpResponse("success")
def getPoint(request):
    schoolId = request.GET["schoolid"]
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
def setPoint(request):
    data = request.body.decode("utf-8")
    #data = json.loads(data)
    points = data
    print("points data",points)
    schoolId = request.GET["schoolid"]

    try:
        SQL = "UPDATE schoolData SET points='{}' WHERE schoolId = {}".format(points, schoolId)
        cursor = connect.cursor()
        cursor.execute(SQL)
        connect.commit()
        return HttpResponse("success")
    except:
        return HttpResponse("error")
def getChart(request):

    dateData = []  # 日期列表
    exData1 = []  # type=0的数据列表
    exData2 = []  # type=1的数据列表
    pre_sevenDay = (date.today() + timedelta(-7))  # 七天前 如今日4.11，则为4.4
    cursor = connect.cursor()

    for i in range(7):
        # 写入日期
        time_delta = timedelta(i)
        cur_date = (pre_sevenDay + time_delta).strftime('%Y-%m-%d')
        dateData.append(cur_date)
        print("date",cur_date)
        # 取出type=0的数据列表
        SQL1 = "SELECT number FROM sevenDay WHERE date = '{}' AND type = 0".format(cur_date)
        number1 = cursor.execute(SQL1).fetchall()
        print(number1)
        try:
            result_number1 = int(number1[0][0])
        except Exception as e:
            result_number1=0
        exData1.append(result_number1)

        # 取出type=1的数据列表
        SQL2 = "SELECT number FROM sevenDay WHERE date = '{}' AND type = 1".format(cur_date)
        number2 = cursor.execute(SQL2).fetchall()
        try:
            result_number2 = int(number2[0][0])
        except:
            result_number2=0
        exData2.append(result_number2)

    data = {"date": dateData, "exData1": exData1, "exData2": exData2}
    return HttpResponse(json.dumps(data))
def getRecord(request):
    SQL = "SELECT * FROM record LIMIT 100"
    cursor = connect.cursor()
    try:
        result = cursor.execute(SQL).fetchall()
    except:
        result=[]
    result_list = []
    for data in result:
        name = data[0]
        number = data[1]
        time = data[2]
        content = data[3]
        dic = {"name": name, "number": number, "time": time, "content": content}
        result_list.append(dic)
    data = json.dumps(result_list)
    return HttpResponse(data)
def getTeacherList(request):
    schoolid=request.GET["schoolid"]
    data=[]
    SQL="SELECT * FROM manager WHERE schoolid='{}'".format(schoolid)
    cursor=connect.cursor()
    result=cursor.execute(SQL).fetchall()
    for item in result:
        data.append({
            "name":item[1],
            "number":item[2],
            "id":item[0],
            "pass":item[3],
            "lock":False if item[-1]=="0" else True
        })
    return HttpResponse(json.dumps(data))
def getSchoolList(request):
    SQL_school = "SELECT schoolId, schoolName FROM schoolData"
    cursor = connect.cursor()
    school = cursor.execute(SQL_school).fetchall()

    school_list = []
    for i in school:
        dic = {"number": i[0], "name": i[1]}
        school_list.append(dic)
    # school_list = json.dumps(school_list)
    school_list = {"schoolList": school_list}
    print("school", school_list)
    return HttpResponse(json.dumps(school_list))
def setTeacherInfo(request):
    data = request.body.decode("utf-8")
    data = json.loads(data)
    name = data["name"]
    password = data["password"]
    schoolId = data["schoolid"]
    username = request.GET["username"]

    try:
        SQL = "UPDATE manager SET name='{}',password='{}',schoolId={} WHERE username = '{}'".format(name, password,
                                                                                               schoolId, username)
        cursor = connect.cursor()
        cursor.execute(SQL)
        connect.commit()
        date = datetime.now().strftime('%Y-%m-%d')
        name = "UPDATE"
        number = request.headers['X-Forwarded-For']
        SQL = "INSERT INTO record(name,number,time,content) VALUES ('{}','{}','{}','{}')".format(name, number, date,
                                                                                                 "设置教师信息")
        cursor.execute(SQL)
        connect.commit()
        return HttpResponse("success")
    except:
        return HttpResponse("error")
def setStudentInfo(request):
    data = request.body.decode("utf-8")
    data = json.loads(data)
    name = data["name"]
    class1 = data["class"]
    schoolId = data["schoolid"]
    openid = request.GET["openid"]
    try:
        SQL = "UPDATE studentInfo SET name='{}',class={},schoolId={} WHERE openid = '{}'".format(name, class1, schoolId,
                                                                                                 openid)
        cursor = connect.cursor()
        cursor.execute(SQL)
        connect.commit()
        date = datetime.now().strftime('%Y-%m-%d')
        name = "UPDATE"
        number = request.headers['X-Forwarded-For']
        SQL = "INSERT INTO record(name,number,time,content) VALUES ('{}','{}','{}','{}')".format(name, number, date,
                                                                                                 "设置学生信息")
        cursor.execute(SQL)
        connect.commit()
        return HttpResponse("success")
    except:
        return HttpResponse("error")
