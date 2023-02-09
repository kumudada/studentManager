<template>
    <div class="studentShow">
        <div class="header">
            <el-button type="primary" @click="getExcel()" plain>导出为Excel文件</el-button>
        </div>
        <table v-if="showTable" id="table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>性别</th>
                    <th>年级</th>
                    <th>班级</th>
                    <th>手机号码</th>
                    <th>所在城市</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, index) in Test.student" :key="index">
                    <tr>
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.stuNumber }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.age }}</td>
                        <td>{{ item.sex }}</td>
                        <td>{{ item.grade }}</td>
                        <td>{{ item.class }}</td>
                        <td>{{ item.tel }}</td>
                        <td>{{ item.city }}</td>
                        <td>
                            <button class="editBtn" @click="editStu(item)">编辑</button>
                            <button class="delectBtn" @click="delectStu(item.stuNumber)">删除</button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
    <!-- 删除学生信息 -->
    <div>
        <el-dialog v-model="dialogFormVisible" title="删除学生信息" :close-on-click-modal="closeClickModal">
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormClose(false)">取消</el-button>
                    <el-button type="primary" @click="dialogFormClose(true)"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <!-- 编辑学生信息 -->
    <div>
        <el-dialog v-model="dialogTableVisible" title="编辑学生信息">
            <div id="edit">
                <el-form ref="form" :model="FormData" label-width="auto" :label-position="labelPosition" :size="size">
                    <el-form-item label="学号">
                        <el-input v-model="FormData.number" />
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="FormData.name" />
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="FormData.age" />
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="FormData.gender">
                            <el-radio border label="男" />
                            <el-radio border label="女" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-select v-model="FormData.reged" placeholder="请选择">
                            <el-option label="大一" value="大一" />
                            <el-option label="大二" value="大二" />
                            <el-option label="大三" value="大三" />
                            <el-option label="大四" value="大四" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-select v-model="FormData.class" placeholder="请选择">
                            <div v-for="(item, index) in classList" :key="item.id">
                                <el-option :label="item.class" :value="item.class" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业">
                        <el-select v-model="FormData.major" placeholder="请选择">
                            <div v-for="(item, index) in majorList" :key="item.id">
                                <el-option :label="item.major" :value="item.major" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在省份">
                        <el-input v-model="FormData.province" />
                    </el-form-item>
                    <el-form-item label="所在城市">
                        <el-input v-model="FormData.city" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import * as XLSX from "xlsx";
    // 引入请求文件
    import { request } from "@/network/request.js";
    import { useTestStore } from "@/store";
    import { ElMessageBox, ElMessage } from "element-plus";
    import { ElLoading } from "element-plus";
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    const Test = useTestStore();

    let showTable = ref(true);
    // 导出为excil
    function deriveExcel() {
        let workbook = XLSX.utils.table_to_book(document.getElementById("table")); //需要在table上定义一个id
        try {
            XLSX.writeFile(workbook, "student.xlsx");
            ElMessage({
                type: "success",
                message: "导出成功!",
            });
        } catch (e) {
            ElMessage.error("导出失败,失败信息:!");
        }
    }
    let getExcel = () => {
        deriveExcel();
    };

    // 控制弹窗的数据
    const dialogTableVisible = ref(false);
    const dialogFormVisible = ref(false);
    const closeClickModal = ref(false);
    // 信息提示
    // 弹出错误信息
    function errMsg(msg: string) {
        ElMessage({
            showClose: true,
            message: msg,
            type: "error",
        });
    }
    // 弹出正确提示
    function successMsg(msg: string) {
        ElMessage({
            showClose: true,
            message: msg,
            type: "success",
        });
    }
    // 获取点击的按钮
    function getResult(value: boolean) {
        if (!value) {
            // 点击取消按钮后
            errMsg("取消操作");
        } else {
            successMsg("操作成功");
        }
    }
    // 获取信息
    function getData() {
        // 获取学生信息
        request(
            {
                url: "/getStudent",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                // 储存数据
                Test.student = result.data;
                sessionStorage.setItem("studentData", JSON.stringify(result.data));
            },
            (err: any) => {}
        );
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
    }
    //刚开始获取数据
    getData();

    // 删除学生
    let delectStudentStatus = ref(false);
    // 弹出框回调函数
    function dialogFormClose(value: boolean) {
        dialogFormVisible.value = false;
        if (value) {
            delectStudentStatus.value = true;
            let StuNumber = localStorage.getItem("delectStuNumber");
            // 删除学生信息的请求
            request(
                {
                    url: "/delectStudent",
                    method: "post",
                    data: {
                        stuNumber: StuNumber,
                    },
                },
                (res: any) => {
                    if (res.data.success) {
                        successMsg(res.data.msg); // 删除提示
                        getData(); // 再获取一次数据
                        showTable.value = false; // 删除dom
                        showTable.value = true; // 重新渲染表格
                    }
                },
                (error: any) => {
                    console.log(error);
                    errMsg("请求错误,请稍后重试");
                    return;
                }
            );
        } else {
            delectStudentStatus.value = false;
        }
    }
    // 删除学生
    function delectStu(data: object) {
        let authority = sessionStorage.getItem("authority");
        if (authority === "root") {
            sessionStorage.removeItem("delectStuNumber");
            // 将所选学号存入储存
            sessionStorage.setItem("delectStuNumber", JSON.stringify(data));
            // 显示弹窗
            dialogFormVisible.value = true;
        } else {
            errMsg("权限不足");
            return;
        }
    }

    // 编辑学生
    // 获取班级列表
    let classList = reactive(JSON.parse(sessionStorage.getItem("classList")));
    // 获取专业列表
    let majorList = reactive(JSON.parse(sessionStorage.getItem("majorList")));
    // 配置项
    const size = ref("default"); // 表单尺寸
    const labelPosition = ref("left"); // 表单对齐方式
    // 数据
    let FormData = reactive({
        id: "", // id
        name: "", // 姓名
        age: "", // 年龄
        number: "", // 学号
        class: "", // 班级
        major: "", // 专业
        reged: "", // 年级
        gender: "", // 性别
        province: "", // 省份
        city: "", // 城市
    });
    function editStu(data: object) {
        let authority = sessionStorage.getItem("authority"); // 当前用户的权限
        if (authority == "root") {
            // 赋值原始的数据
            FormData.id = data.id;
            FormData.name = data.name;
            FormData.age = data.age;
            FormData.number = data.stuNumber;
            FormData.class = data.class;
            FormData.reged = data.grade;
            FormData.gender = data.sex;
            FormData.province = data.province;
            FormData.city = data.city;
            FormData.major = data.major;
            dialogTableVisible.value = true; // 显示对话框
        } else {
            showMessage.errMsg("暂无权限执行此操作!");
            return;
        }
        // console.log(data);
    }
    // 提交更改
    function onSubmit() {
        let authority = sessionStorage.getItem("authority");
        if (authority == "root") {
            // 提交请求
            request(
                {
                    url: "editStudent",
                    method: "post",
                    data: FormData,
                },
                (res: any) => {
                    let result = res.data;
                    if (result.success) {
                        successMsg(result.msg);
                        dialogTableVisible.value = false; // 关闭对话框
                        getData(); // 再获取一次数据
                        showTable.value = false; // 删除dom
                        showTable.value = true; // 重新渲染表格
                    }
                },
                (error: any) => {
                    console.log(error);
                    errMsg("请求错误,请稍后重试");
                    return;
                }
            );
        } else {
            errMsg("权限不足");
            return;
        }
    }
</script>

<style lang="less" scoped>
    .header {
        display: flex;
        align-items: center;
        width: 90%;
        height: 55px;
        padding-left: 15px;
    }
    .el-button--text {
        margin-right: 15px;
    }
    .el-select {
        width: 300px;
    }
    .el-input {
        width: 300px;
    }
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
    table {
        border-collapse: collapse;
        width: 90%;
        font-size: 1.1vw;
        margin-left: 15px;
        thead {
            th {
                border: 1px solid #ccc;
                height: 35px;
            }
        }
        tbody {
            overflow-y: scroll;
            td {
                padding: 5px 10px;
                button {
                    cursor: pointer;
                }
                .editBtn {
                    border: 0;
                    padding: 5px 10px;
                    color: #fff;
                    margin-right: 20px;
                    background-color: rgb(82, 194, 239);
                    border-radius: 5px;
                }
                .delectBtn {
                    border: 0;
                    padding: 5px 10px;
                    color: #fff;
                    background-color: rgb(247, 45, 45);
                    border-radius: 5px;
                }
            }
        }
        tr {
            text-align: center;
            td {
                border: 1px solid #ccc;
            }
            transition: all 0.3s;
            &:hover {
                background-color: rgb(237, 237, 237);
            }
        }
    }
</style>
