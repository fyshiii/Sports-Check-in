from . import views as v
from django.urls import path
from django.urls import path
urlpatterns=[
    path("back/userLogin",v.login),
    path("back/lockTeacher",v.lockTeacher),
    path("back/getClass",v.getClass),
    path("back/delTeacher",v.delTeacher),
    path("back/getStudentData",v.getStudentData),
    path("back/getStudentList",v.getStudentList),
    path("back/lockStudent",v.lockStudent),
    path("back/delStudent",v.delStudent),
    path("back/getPoint",v.getPoint),
    path("back/setPoint",v.setPoint),
    path("back/getClassList",v.getclassList),
    path("back/getChart",v.getChart),
    path("back/getRecord",v.getRecord),
    path("back/getTeacherList",v.getTeacherList),
    path('back/getSchoolList',v.getSchoolList),
    path("back/setTeacherInfo",v.setTeacherInfo),
    path("back/setStudentInfo",v.setStudentInfo),
]