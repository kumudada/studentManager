<template>
    <div class="wrap">
        <el-form :model="form" label-width="120px" label-position="left">
            <!-- 编号 -->
            <el-form-item label="编号">
                <el-input v-model="form.workid" />
            </el-form-item>
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
                <el-radio-group v-model="form.gender">
                    <el-radio label="男" border />
                    <el-radio label="女" border />
                </el-radio-group>
            </el-form-item>
            <!-- 电话号码 -->
            <el-form-item label="电话号码">
                <el-input v-model="form.tel" />
            </el-form-item>
            <!-- 部门 -->
            <el-form-item label="所在部门">
                <el-select v-model="form.department" placeholder="请选择">
                    <div v-for="(item, index) in departmentList" :key="index">
                        <el-option :label="item.name" :value="item.name" />
                    </div>
                </el-select>
            </el-form-item>
            <!-- 职称等级 -->
            <el-form-item label="职称等级">
                <el-select v-model="form.professional" placeholder="请选择">
                    <template v-for="(item, index) in professionalList" :key="index">
                        <el-option :label="item.name" :value="item.name" />
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    // 引入请求文件
    import { request } from "@/network/request.js";
    import { useTestStore } from "@/store";
    const Test = useTestStore();
    // 请求数据
    function getData() {
        // 获取部门列表
        request(
            {
                url: "getDepartment",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                sessionStorage.setItem("departmentList", JSON.stringify(result.data));
            },
            (err: any) => {
                console.log(err);
                showMessage.errMsg("服务器错误");
            }
        );
        // 获取职称列表
        request(
            {
                url: "getProfessional",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                sessionStorage.setItem("professionalList", JSON.stringify(result.data));
            },
            (err: any) => {
                console.log(err);
                showMessage.errMsg("服务器错误");
            }
        );
    }
    getData();
    // 获取部门列表和职称列表
    let departmentList = JSON.parse(sessionStorage.getItem("departmentList"));
    let professionalList = JSON.parse(sessionStorage.getItem("professionalList"));
    // 手机号验证正则
    let telReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    const form = reactive({
        workid: "", // 编号
        name: "", // 姓名
        age: "", // 年龄
        gender: "", // 性别
        tel: "", // 电话
        department: "", // 部门
        professional: "", // 职称
    });

    const onSubmit = () => {
        // 为空校验
        if (
            form.workid === "" ||
            form.name === "" ||
            form.age === "" ||
            form.gender === "" ||
            form.tel === "" ||
            form.department === "" ||
            form.professional === ""
        ) {
            showMessage.errMsg("请填写完整信息");
            return;
        }
        // 手机号校验
        if (!telReg.test(form.tel)) {
            showMessage.errMsg("手机号码格式错误");
            return;
        }
        // 发送请求
        request(
            {
                url: "addTeacher",
                method: "post",
                data: form,
            },
            (res: any) => {
                let result = res.data;
                if(result.success){
                    showMessage.successMsg("提交成功");
                }else{
                    showMessage.errMsg("请勿重复添加");
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    };
</script>

<style lang="less" scoped>
    .wrap {
        padding: 20px 0px 0px 20px;
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
