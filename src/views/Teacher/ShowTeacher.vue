<template>
    <div class="showTeacher">
        <div class="header">
            <el-button type="primary" @click="getExcel()" plain>导出为Excel文件</el-button>
        </div>
        <table v-if="showTable" id="table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>编号</th>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>性别</th>
                    <th>电话号码</th>
                    <th>部门</th>
                    <th>职称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, index) in Test.teacher" :key="index">
                    <tr>
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.workid }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.age }}</td>
                        <td>{{ item.gender }}</td>
                        <td>{{ item.tel }}</td>
                        <td>{{ item.department }}</td>
                        <td>{{ item.professional }}</td>
                        <td>
                            <button class="editBtn" @click="editTeacher(item)">编辑</button>
                            <button class="delectBtn" @click="deleteTeacher(item.id)">删除</button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
    <!-- 删除教师信息 -->
    <div>
        <el-dialog v-model="dialogFormVisible" title="删除教师信息" :close-on-click-modal="closeClickModal">
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
        <el-dialog v-model="dialogTableVisible" title="编辑教师信息">
            <div id="edit">
                <el-form ref="form" :model="FormData" label-width="auto">
                    <el-form-item label="编号">
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
                    <el-form-item label="电话号码">
                        <el-input v-model="FormData.tel" />
                    </el-form-item>
                    <el-form-item label="部门">
                        <el-select v-model="FormData.department" placeholder="请选择">
                            <div v-for="(item, index) in Test.departmentList" :key="index">
                                <el-option :label="item.name" :value="item.name" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职称">
                        <el-select v-model="FormData.professional" placeholder="请选择">
                            <div v-for="(item, index) in Test.professionalList" :key="index">
                                <el-option :label="item.name" :value="item.name" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateTeacher()">提交</el-button>
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
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    const Test = useTestStore();
    // 控制表格显示
    let showTable = ref(true);
    // 模块一：展示基本信息
    // 1.请求教师数据
    // 请求数据
    function getData() {
        // 获取教师的全部信息
        request(
            {
                url: "getTeacherData",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                // 存储到pinia test.teacher
                Test.setTeacherData(result.data);
            },
            (err: any) => {
                console.log(err);
                showMessage.errMsg("服务器错误");
            }
        );
        // 获取部门列表
        request(
            {
                url: "getDepartment",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                Test.departmentList = result.data;
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
                // sessionStorage.setItem('departmentList',)
                Test.professionalList = result.data;
            },
            (err: any) => {
                console.log(err);
                showMessage.errMsg("服务器错误");
            }
        );
    }
    getData();
    // 处理数据的展示
    // 是否在编制内
    function handlerWeave(val: number) {
        if (val == 0) {
            return "否";
        } else {
            return "是";
        }
    }
    // 导出为excil
    function deriveExcel() {
        let workbook = XLSX.utils.table_to_book(document.getElementById("table")); //需要在table上定义一个id
        try {
            XLSX.writeFile(workbook, "teacher.xlsx");
            ElMessage({
                type: "success",
                message: "导出成功!",
            });
        } catch (e) {
            ElMessage.error("导出失败,失败信息:!");
        }
    }
    // 导出表格文件模块
    function getExcel() {
        deriveExcel();
    }
    // 模块二：删除信息
    // 1.
    // 控制弹窗的数据
    const dialogTableVisible = ref(false);
    const dialogFormVisible = ref(false);
    const closeClickModal = ref(false);
    // 2. 删除按钮点击事件
    function deleteTeacher(value: number) {
        // value 为 表id
        let authority = sessionStorage.getItem("authority"); // 当前用户的权限
        if (authority === "root") {
            sessionStorage.removeItem("teachId");
            // 将所选教师表id存入储存
            sessionStorage.setItem("teachId", JSON.stringify(value));
            // 显示弹窗
            dialogFormVisible.value = true;
        } else {
            showMessage.errMsg("权限不足");
            return;
        }
    }
    // 弹出框回调函数
    function dialogFormClose(value: boolean) {
        dialogFormVisible.value = false; // 关闭弹窗
        if (value) {
            let TeachId = JSON.parse(sessionStorage.getItem("teachId")); // 获取要删除的表id
            // 发送请求
            request(
                {
                    url: "deleteTeacher",
                    method: "post",
                    data: {
                        id: TeachId,
                    },
                },
                (res: any) => {
                    let result = res.data;
                    if (result.success) {
                        getData(); // 重新获取数据
                        // 重新渲染数据
                        showTable.value = false;
                        showTable.value = true;
                    } else {
                        showMessage.errMsg("服务器错误");
                        return;
                    }
                },
                (err: any) => {
                    console.log(err);
                    showMessage.errMsg("服务器错误");
                }
            );
            showMessage.successMsg("删除成功");
        } else {
            showMessage.errMsg("取消操作");
            return;
        }
    }
    // 模块三：修改信息
    // 1.
    // 数据
    let FormData = reactive({
        id: "", // id
        number: "", // 编号
        name: "", // 姓名
        age: "", // 年龄
        gender: "", // 性别
        tel: "", // 电话
        department: "", // 部门
        professional: "", // 职称
    });
    // 编辑按钮触发事件
    function editTeacher(val: object) {
        let authority = sessionStorage.getItem("authority"); // 当前用户的权限
        if (authority == "root") {
            dialogTableVisible.value = true; // 打开弹窗
            // 赋值初识数据
            FormData.id = val.id;
            FormData.number = val.workid;
            FormData.name = val.name;
            FormData.age = val.age;
            FormData.gender = val.gender;
            FormData.tel = val.tel;
            FormData.department = val.department;
            FormData.professional = val.professional;
        } else {
            showMessage.errMsg("暂无权限执行此操作!");
            return;
        }
    }
    // 提交按钮
    function updateTeacher() {
        dialogTableVisible.value = false; // 关闭弹窗
        console.log(FormData);
        request(
            {
                url: "updateTeacher",
                method: "post",
                data: FormData,
            },
            (res: object) => {
                let result = res.data;
                if (result.success) {
                    getData(); // 重新获取数据
                    showMessage.successMsg("修改成功");
                    showTable.value = false;
                    showTable.value = true;
                } else {
                    showMessage.errMsg("服务器错误");
                    return;
                }
            },
            (err: any) => {
                showMessage.errMsg("服务器错误");
                return;
            }
        );
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
