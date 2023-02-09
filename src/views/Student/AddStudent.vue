<template>
    <div class="warp">
        <el-form :model="form" label-width="120px" label-position="left">
            <!-- 姓名 -->
            <el-form-item label="姓名">
                <el-input v-model="form.name" />
            </el-form-item>
            <!-- 年龄 -->
            <el-form-item label="年龄">
                <el-input v-model="form.age" />
            </el-form-item>
            <!-- 性别 -->
            <el-form-item label="性别">
                <el-radio-group v-model="form.sex">
                    <el-radio border label="男" />
                    <el-radio border label="女" />
                </el-radio-group>
            </el-form-item>
            <!-- 学号 -->
            <el-form-item label="学号">
                <el-input v-model="form.stuNumber" />
            </el-form-item>
            <!-- 电话号码 -->
            <el-form-item label="电话号码">
                <el-input v-model="form.tel" />
            </el-form-item>
            <!-- 年级 -->
            <el-form-item label="年级">
                <el-select v-model="form.grade" placeholder="选择年级">
                    <el-option label="大一" value="大一" />
                    <el-option label="大二" value="大二" />
                    <el-option label="大三" value="大三" />
                    <el-option label="大四" value="大四" />
                </el-select>
            </el-form-item>
            <!-- 班级 -->
            <el-form-item label="所在班级">
                <el-select v-model="form.class" placeholder="请选择">
                    <div v-for="(item, index) in classList" :key="item.id">
                        <el-option :label="item.class" :value="item.class" />
                    </div>
                </el-select>
            </el-form-item>
            <!-- 所学专业 -->
            <el-form-item label="所学专业">
                <el-select v-model="form.major" placeholder="请选择">
                    <div v-for="(item, index) in majorList" :key="item.id">
                        <el-option :label="item.major" :value="item.major" />
                    </div>
                </el-select>
            </el-form-item>
            <!-- 地址 -->
            <el-form-item label="所在省份">
                <el-input v-model="form.province" placeholder="所在省份" />
            </el-form-item>
            <el-form-item label="所在城市">
                <el-input v-model="form.city" placeholder="所在市/区" />
            </el-form-item>
            <!-- 管理老师 -->
            <el-form-item label="管理教师">
                <el-select v-model="form.manager" placeholder="请选择">
                    <div v-for="(item, index) in teacherList" :key="index">
                        <el-option :label="item.name" :value="item.name" />
                    </div>
                </el-select>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    // 引入请求文件
    import { request } from "@/network/request.js";
    const router = useRouter;
    // 获取信息
    function getData() {
        // 获取班级列表
        request(
            {
                url: "getClassData",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                sessionStorage.setItem("classList", JSON.stringify(result.data));
            },
            (err: any) => {
                console.log(err);
            }
        );
        // 获取专业列表
        request(
            {
                url: "getMajorData",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                sessionStorage.setItem("majorList", JSON.stringify(result.data));
            },
            (err: any) => {
                console.log(err);
            }
        );
        // 获取教师列表
        request(
            {
                url: "getTeacherList",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                sessionStorage.setItem("teacherList", JSON.stringify(result.data));
            },
            (err: any) => {
                console.log(err);
            }
        );
    }
    // 获取基本数据
    getData();
    // 获取班级列表
    let classList = reactive(JSON.parse(sessionStorage.getItem("classList")));
    // 获取专业列表
    let majorList = reactive(JSON.parse(sessionStorage.getItem("majorList")));
    // 获取教师列表
    let teacherList = reactive(JSON.parse(sessionStorage.getItem("teacherList")));
    // 手机号验证正则
    let telReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    // 储存输入的数据
    const form = reactive({
        name: "", // 姓名
        age: "", // 年龄
        sex: "男", // 性别
        stuNumber: "", // 学号
        tel: "", // 手机号
        grade: "", // 年级
        class: "", // 班级
        major: "", // 专业
        province: "", // 省份
        city: "", // 城市
        manager: "", // 管理老师
    });
    // 提交信息
    const onSubmit = () => {
        console.log(form);
        // 验证手机号格式是否正确
        if (!telReg.test(form.tel)) {
            showMessage.errMsg("手机号码格式不正确");
            return;
        }
        // 学号是否为空
        if (form.stuNumber == "") {
            showMessage.errMsg("学号不能为空");
            return;
        }
        request(
            {
                url: "addStudentData",
                method: "post",
                data: form,
            },
            (res: any) => {
                let result = res.data;
                if (result.success) {
                    // 新建学生
                    showMessage.successMsg(result.msg);
                } else {
                    // 学号存在
                    showMessage.errMsg(result.msg);
                }
            },
            (error: any) => {
                console.log(error);
                showMessage.errMsg("服务器错误");
            }
        );
    };
</script>

<style lang="less" scoped>
    .warp {
        padding: 15px;
        padding-left: 30px;
    }

    .el-button--text {
        margin-right: 15px;
    }
    .el-select {
        width: 500px;
    }
    .el-input {
        width: 500px;
    }
</style>
