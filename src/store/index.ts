import {defineStore} from 'pinia'
import {Names} from './store-name'

export const useTestStore = defineStore(Names.TEST,{
    state:()=>{
        return {
            // 用户信息
            user:{},
            student:[],//储存学生信息
            teacher:[],//储存教师信息,
            professionalList:[],// 职称列表
            departmentList:[],// 部门列表
            classList:[],// 班级列表
            ManagerList:[],// 教师列表
            MajorList:[],// 专业列表
            CollegeList:[],// 学院列表
            UserList:[],
        }
    },
    // 类似computed 修饰一些值
    getters:{

    },
    // 类似methods 同步和异步都可以做 提交state
    actions:{
        setTeacherData(value:any):void{
            this.teacher = value;
        },
        setClassData(value:any):void{
            this.classList = value;
        },
        setManagerList(value:any){
            this.ManagerList = value;
        },
        setMajorList(value:any):void{
            this.MajorList = value;
        },
        setCollegeList(value:any):void{
            this.CollegeList = value;
        },
        // 设置用户信息
        setUser(value: any):void{
            this.user = value;
        },
        // 设置用户表信息
        setUserList(value: any):void{
            this.UserList = value;
        }
    }
})
