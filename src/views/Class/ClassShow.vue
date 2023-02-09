<template>
    <div id="warp">
        <div class="header">
            <!-- 搜索 -->
            <el-input v-model="input" class="input-with-select" @input="inputChange()">
                <template #prepend>
                    <el-select v-model="select" placeholder="搜索方式" style="width: 115px">
                        <el-option label="全部班级" value="1" />
                        <el-option label="班级名称" value="2" />
                        <el-option label="负责导师" value="3" />
                        <el-option label="所属专业" value="4" />
                    </el-select>
                </template>
            </el-input>
            <!-- 导出文件 -->
            <el-button type="primary" @click="getExcel()" plain>导出为Excel文件</el-button>
            <!-- 添加信息 -->
            <el-button type="success" @click="addClass" plain>添加班级信息</el-button>
        </div>
        <table v-if="showTable" id="table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>班级名称</th>
                    <th>负责导师</th>
                    <th>所属专业</th>
                    <th>所属学院</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in Store.classList" :key="index">
                    <td>
                        {{ index + 1 }}
                    </td>
                    <td>
                        {{ item.class }}
                    </td>
                    <td>
                        {{ item.manager }}
                    </td>
                    <td>
                        {{ item.major }}
                    </td>
                    <td>
                        {{ item.college }}
                    </td>
                    <td>
                        <button class="editBtn" @click="editClass(item)">编辑</button>
                        <button class="delectBtn" @click="delClass(item.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- 删除弹窗 -->
    <div>
        <el-dialog v-model="dialogFormVisible" title="删除教师信息" :close-on-click-modal="closeClickModal">
            <p>此操作无法撤销，请谨慎选择</p>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormClose(false)">取消</el-button>
                    <el-button type="primary" @click="dialogFormClose(true)"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <!-- 新建班级信息 -->
    <div>
        <el-dialog v-model="dialogAddVisible" title="新建班级信息">
            <div id="edit">
                <el-form ref="form" :model="AddFormData" label-width="auto" :label-position="labelPosition">
                    <el-form-item label="班级名称">
                        <el-input v-model="AddFormData.class" />
                    </el-form-item>
                    <el-form-item label="负责教师">
                        <el-select v-model="AddFormData.manager" placeholder="请选择">
                            <div v-for="(item, index) in Store.ManagerList" :key="index">
                                <el-option :label="item.name" :value="item.name" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属专业">
                        <el-select v-model="AddFormData.major" placeholder="请选择">
                            <div v-for="(item, index) in Store.MajorList" :key="index">
                                <el-option :label="item.major" :value="item.major" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属学院">
                        <el-select v-model="AddFormData.college" placeholder="请选择">
                            <div v-for="(item, index) in Store.CollegeList" :key="index">
                                <el-option :label="item.name" :value="item.name" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="AddDataSubmit">确认添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
    <!-- 编辑班级信息 -->
    <div>
        <el-dialog v-model="dialogEditVisible" title="编辑班级信息">
            <div id="edit">
                <el-form ref="form" :model="EditFormData" label-width="auto" :label-position="labelPosition">
                    <el-form-item label="班级名称">
                        <el-input v-model="EditFormData.class" />
                    </el-form-item>
                    <el-form-item label="负责教师">
                        <el-select v-model="EditFormData.manager" placeholder="请选择">
                            <div v-for="(item, index) in Store.ManagerList" :key="index">
                                <el-option :label="item.name" :value="item.name" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属专业">
                        <el-select v-model="EditFormData.major" placeholder="请选择">
                            <div v-for="(item, index) in Store.MajorList" :key="index">
                                <el-option :label="item.major" :value="item.major" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属学院">
                        <el-select v-model="EditFormData.college" placeholder="请选择">
                            <div v-for="(item, index) in Store.CollegeList" :key="index">
                                <el-option :label="item.name" :value="item.name" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="EditDataSubmit">确认添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import * as XLSX from "xlsx";
    import { useTestStore } from "@/store"; // pinia
    // 引入请求文件
    import { request } from "@/network/request.js";
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    import { error } from "console";
    const Store = useTestStore();
    // 接收输入的值
    const input = ref("");
    const select = ref("1");
    // 控制表格显示
    let showTable = ref(true);
    // 删除弹窗提示
    let dialogAddVisible = ref(false); // 添加新数据
    let dialogFormVisible = ref(false);
    const closeClickModal = ref(false);
    const labelPosition = ref("top"); // 表单对齐方式
    // 导出模块
    // 导出为excil
    function deriveExcel() {
        let workbook = XLSX.utils.table_to_book(document.getElementById("table")); //需要在table上定义一个id
        try {
            XLSX.writeFile(workbook, "class.xlsx");
            showMessage.successMsg("导出成功");
        } catch (e) {
            showMessage.errMsg("导出失败!");
        }
    }
    let getExcel = () => {
        deriveExcel();
    };
    // 展示数据模块
    function getData() {
        // 获取班级信息
        request(
            {
                url: "getClass",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                // 存储数据
                Store.setClassData(result.data);
            },
            (err: any) => {}
        );
        // 获取专业列表
        request(
            {
                url: "getMajorData",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                // 存储数据
                Store.setMajorList(result.data);
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
                // 存储数据
                Store.setManagerList(result.data);
            },
            (err: any) => {
                console.log(err);
            }
        );
        // 获取学院列表
        request(
            {
                url: "getCollegeList",
                method: "get",
            },
            (res: any) => {
                let result = res.data;
                Store.setCollegeList(result.data);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }
    getData();
    // 删除数据模块
    // 删除按钮事件
    function delClass(val: any) {
        dialogFormVisible.value = true;
        sessionStorage.setItem("delClassid", val);
    }
    // 删除弹窗
    function dialogFormClose(val: boolean) {
        dialogFormVisible.value = false;
        if (val) {
            let authority = sessionStorage.getItem("authority"); // 当前用户的权限
            if (authority == "root") {
                let id = sessionStorage.getItem("delClassid");
                request(
                    {
                        url: "delClass",
                        method: "post",
                        data: {
                            id: id,
                        },
                    },
                    (res: any) => {
                        let result = res.data;
                        if (result.success) {
                            showMessage.successMsg("删除成功");
                            getData();
                            showTable.value = false;
                            showTable.value = true;
                        }
                    },
                    (err: any) => {
                        showMessage.errMsg("删除失败!");
                        return;
                    }
                );
            } else {
                showMessage.errMsg("权限不足");
                return;
            }
        }
    }

    // 搜索模块
    function inputChange() {
        // 发送请求
        request(
            {
                url: "searchClass",
                method: "post",
                data: {
                    input: input,
                    select: select,
                },
            },
            (res: any) => {
                let result = res.data;
                // 存储数据
                Store.setClassData(result.data);
                showTable.value = false;
                showTable.value = true;
            },
            (error: any) => {
                showMessage.errMsg("服务器错误");
                return;
            }
        );
    }

    // 添加模块
    // 数据
    let AddFormData = reactive({
        class: "", // 班级名称
        manager: "", // 负责教师
        major: "", // 所属专业
        college: "", // 学号
    });
    // 添加按钮事件
    function addClass() {
        dialogAddVisible.value = true;
    }
    // 提交添加的事件
    function AddDataSubmit() {
        if (AddFormData.class == "" || AddFormData.manager == "" || AddFormData.major == "" || AddFormData.college == "") {
            showMessage.errMsg("请填写完整信息");
            return;
        }
        request(
            {
                url: "addClassData",
                method: "post",
                data: AddFormData,
            },
            (res: any) => {
                console.log(res);
                let result = res.data;
                if (result.success) {
                    showMessage.successMsg("添加成功");
                    getData();
                } else {
                    showMessage.errMsg(result.msg);
                }
            },
            (err: any) => {
                showMessage.errMsg("服务器错误");
                return;
            }
        );
    }

    // 编辑模块
    let dialogEditVisible = ref(false);
    let oneData = reactive({
        class: "", // 班级名称
        manager: "", // 负责教师
        major: "", // 所属专业
        college: "", // 学号
    });
    // 数据
    let EditFormData = reactive({
        id: "", //id
        class: "", // 班级名称
        manager: "", // 负责教师
        major: "", // 所属专业
        college: "", // 学院
    });
    // 编辑按钮事件
    function editClass(val: any) {
        let authority = sessionStorage.getItem("authority"); // 当前用户的权限
        if (authority == "root") {
            dialogEditVisible.value = true; // 开启编辑界面
            // 原始数据
            EditFormData.id = val.id;
            EditFormData.class = val.class;
            EditFormData.manager = val.manager;
            EditFormData.major = val.major;
            EditFormData.college = val.college;
        } else {
            showMessage.errMsg("暂无权限执行此操作");
            return;
        }
    }
    // 提交更改
    function EditDataSubmit() {
        if (EditFormData.class == "" || EditFormData.manager == "" || EditFormData.major == "" || EditFormData.college == "") {
            showMessage.errMsg("请填写完整信息");
            return;
        }
        request(
            {
                url: "updateClassData",
                method: "post",
                data: EditFormData,
            },
            (res: object) => {
                let result = res.data;
                if (result.success) {
                    showMessage.successMsg("修改成功");
                    dialogEditVisible.value = false; // 关闭编辑界面
                    getData();
                } else {
                    showMessage.errMsg(result.msg);
                }
            },
            (error: object) => {
                console.log(error);
                showMessage.errMsg("服务器错误");
                return;
            }
        );
    }
</script>

<style lang="less" scoped>
    // 表单样式
    .input-with-select .el-input-group__prepend {
        background-color: var(--el-fill-color-blank);
    }
    .el-input {
        width: 300px;
    }
    .input-with-select {
        width: 50%;
        margin-right: 25px;
    }
    .header {
        display: flex;
        align-items: center;
        width: 90%;
        height: 55px;
        padding-left: 15px;
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
