import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        children: [
            {
                path: "/",
                redirect: "control",
            },
            {
                path: "control",
                name: "Control", // 控制面板
                component: () => import("@/views/Control/Control.vue"),
                meta: {
                    title: "主页",
                },
            },
            // 学生信息模块
            {
                path: "/student/show",
                name: "showStudent",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Student/showStudent.vue"),
            },
            {
                path: "/student/add",
                name: "AddStudent",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Student/AddStudent.vue"),
            },
            {
                path: "/student/select",
                name: "SelectStudent",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Student/SelectStudent.vue"),
            },
            // 教师信息模块
            {
                path: "/teacher/show",
                name: "ShowTeacher",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Teacher/ShowTeacher.vue"),
            },
            {
                path: "/teacher/add",
                name: "AddTeacher",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Teacher/AddTeacher.vue"),
            },
            {
                path: "/teacher/select",
                name: "SelectTeacher",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Teacher/SelectTeacher.vue"),
            },
            // 班级模块
            {
                path: "/class/show",
                name: "ShowClass",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/Class/ClassShow.vue"),
            },
            // 修改个人信息
            {
                path: "/my/edit",
                name: "editMy",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/My/editMy.vue"),
            },
            //用户权限管理
            {
                path: "/authority/manager",
                name: "authority",
                meta: {
                    title: "学生信息管理系统",
                },
                component: () => import("@/views/authority/userManager.vue"),
            },
        ],
        component: () => import("@/views/Home.vue"),
    },
    {
        path: "/user/login",
        name: "login",
        meta: {
            title: "登录",
        },
        component: () => import("@/views/Login.vue"),
    },
];

// 创建路由
const router = createRouter({
    // history模式：createWebHistory
    history: createWebHistory(),
    routes,
});

// 输出对象
export default router;
