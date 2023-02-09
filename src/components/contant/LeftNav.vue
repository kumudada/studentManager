<template>
    <el-row class="tac">
        <el-col :span="12">
            <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :unique-opened="true">
                <el-menu-item index="1" @click="goControl">
                    <el-icon><Grid /></el-icon>
                    <span>控制面板</span>
                </el-menu-item>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon><UserFilled /></el-icon>
                        <span>学生信息管理</span>
                    </template>
                    <el-menu-item-group title="学生信息">
                        <el-menu-item index="2-1" @click="showStu">查看学生信息 </el-menu-item>
                        <el-menu-item index="2-2" @click="AddStu">添加学生信息</el-menu-item>
                        <el-menu-item index="2-3" @click="SelectStu">查询学生信息</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><Avatar /></el-icon>
                        <span>教师信息管理</span>
                    </template>
                    <el-menu-item-group title="教师信息">
                        <el-menu-item @click="showTeacher()" index="3-1">查看教师信息</el-menu-item>
                        <el-menu-item @click="addTeacher()" index="3-2">添加教师信息</el-menu-item>
                        <el-menu-item @click="selectTeacher()" index="3-3">查询教师信息</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon><ScaleToOriginal /></el-icon>
                        <span>班级信息管理</span>
                    </template>
                    <el-menu-item-group title="班级信息">
                        <el-menu-item index="4-1" @click="showClass()">查看班级列表</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="5">
                    <template #title>
                        <el-icon><Postcard /></el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item-group title="个人中心">
                        <el-menu-item index="5-1" @click="goLogin()">登录</el-menu-item>
                        <el-menu-item index="5-2" @click="goEditMy()">修改个人信息</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="6" v-show="authority == 'root'">
                    <template #title>
                        <el-icon><Operation /></el-icon>
                        <span>权限</span>
                    </template>
                    <el-menu-item-group title="权限管理">
                        <el-menu-item @click="goAuthority()" index="6-1">用户权限管理</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
    // 导入element-plus 菜单
    import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";

    // 使用router
    const router = useRouter();
    const route = useRoute();
    let authority = sessionStorage.getItem("authority"); // 当前用户的权限
    // element meun 事件
    // 打开
    const handleOpen = (key: string, keyPath: string[]) => {
        // console.log(key, keyPath);
    };
    // 关闭
    const handleClose = (key: string, keyPath: string[]) => {
        // console.log(key, keyPath);
    };
    // 设置左边活动的导航
    let defaultActive = ref("1");
    // 监测活动的path
    switch (route.path) {
        case "/control":
            defaultActive.value = "1";
            break;
        case "/student/show":
            defaultActive.value = "2-1";
            break;
        case "/student/add":
            defaultActive.value = "2-2";
            break;
        case "/student/select":
            defaultActive.value = "2-3";
            break;
        case "/teacher/show":
            defaultActive.value = "3-1";
            break;
        case "/teacher/add":
            defaultActive.value = "3-2";
            break;
        case "/teacher/select":
            defaultActive.value = "3-3";
            break;
        case "/class/show":
            defaultActive.value = "4-1";
        case "/my/edit":
            defaultActive.value = "5-2";
        case "/authority/manager":
            defaultActive.value = "6-1";
    }

    // 按钮跳转
    let goLogin = (): void => {
        if (sessionStorage.getItem("token")) {
            sessionStorage.removeItem("token");
            router.push("/user/login"); // 跳转登录
        } else {
            router.push("/user/login"); // 跳转登录
        }
    };

    function goControl(): void {
        router.push("/control"); // 跳转控制面板
    }
    // 跳转查看学生信息
    function showStu(): void {
        router.push("/student/show");
    }
    function SelectStu(): void {
        router.push("/student/select");
    }
    function AddStu(): void {
        router.push("/student/add");
    }
    // 教师信息管理
    function showTeacher() {
        router.push("/teacher/show");
    }
    function addTeacher() {
        router.push("/teacher/add");
    }
    function selectTeacher() {
        router.push("/teacher/select");
    }
    // 班级信息管理
    function showClass() {
        router.push({
            path: "/class/show",
        });
    }
    // 修改个人信息
    function goEditMy() {
        router.push({
            path: "/my/edit",
        });
    }
    // 权限管理
    const goAuthority = () => {
        router.push({
            path: "/authority/manager",
        });
    };
</script>

<style lang="less" scoped>
    // element菜单组件样式
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
        border: 0;
    }
</style>
