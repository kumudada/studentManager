<template>
    <div class="header">
        <!-- 搜索 -->
        <el-input v-model="input" class="input-with-select" @input="inputChange()">
            <template #prepend>
                <el-select v-model="select" placeholder="搜索方式" style="width: 115px">
                    <el-option label="全部用户" value="1" />
                    <el-option label="用户名" value="2" />
                    <el-option label="用户账号" value="3" />
                </el-select>
            </template>
        </el-input>
    </div>
    <table v-if="showTable" id="table">
        <thead>
            <tr>
                <th>序号</th>
                <th>用户名</th>
                <th>账号</th>
                <th>密码</th>
                <th>权限</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in Store.UserList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.pwd }}</td>
                <!-- <td>{{ item.username }}</td> -->
                <td>{{ getAuthority(item.authority) }}</td>
                <td>
                    <button class="editBtn" :disabled="item.id == 1 || item.id == 2" @click="editAuthority(item)">权限</button>
                </td>
            </tr>
        </tbody>
    </table>
    <div>
        <el-dialog v-model="dialogEditVisible" title="编辑用户权限">
            <div id="edit">
                <el-form :inline="false" :model="formInline" class="demo-form-inline">
                    <el-form-item label="用户名">
                        <el-input v-model="formInline.user" placeholder="Approved by" />
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-select v-model="formInline.region" placeholder="请选择要更改的权限">
                            <el-option label="管理员" value="root" />
                            <el-option label="普通用户" value="ordinary" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交更改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { useTestStore } from "@/store"; // pinia
    // 引入请求文件
    import { request } from "@/network/request.js";
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    import { log } from "console";
    const Store = useTestStore();

    // 接收输入的值
    const input = ref("");
    const select = ref("1");
    let showTable = ref(true);

    const getData = () => {
        request(
            {
                url: "userData",
                method: "POST",
                data: {
                    select: select.value,
                    input: input.value,
                },
            },
            (res: any) => {
                const result = res.data;
                Store.setUserList(result.data); // 储存数据
                showTable.value = false;
                showTable.value = true;
            },
            (err: any) => {
                console.log(err);
                showMessage.errMsg("服务器错误");
            }
        );
    };
    getData();
    const inputChange = () => {
        getData();
    };

    // 权限管理模块
    let dialogEditVisible = ref(false);
    const formInline = reactive({
        userid: "",
        user: "",
        region: "",
    });

    // 权限展示
    const getAuthority = (val: any) => {
        if (val == "root") {
            return "管理员";
        } else {
            return "普通用户";
        }
    };
    // 编辑权限
    function editAuthority(data: any) {
        // 开启弹窗
        dialogEditVisible.value = true;
        // 赋值初始数据
        formInline.userid = data.id;
        formInline.user = data.username;
        formInline.region = data.authority;
    }
    // 提交权限
    const onSubmit = () => {
        // 将string 转为 number 形
        formInline.userid = Number(formInline.userid);
        //  发送请求
        request(
            {
                url: "change_authority",
                method: "POST",
                data: formInline,
            },
            (res: any) => {
                if (res.data.success) {
                    dialogEditVisible.value = false;
                    showMessage.successMsg("操作成功");
                    getData();
                } else {
                    showMessage.errMsg(res.data.msg);
                }
            },
            (error: any) => {}
        );
    };
</script>

<style lang="less" scoped>
    .header {
        display: flex;
        align-items: center;
        width: 90%;
        height: 55px;
        padding-left: 15px;
    }
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
