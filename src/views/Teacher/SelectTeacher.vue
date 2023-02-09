<template>
    <div id="warp">
        <div class="header">
            <el-input v-model="input" class="input-with-select" @input="inputChange()">
                <template #prepend>
                    <el-select v-model="select" placeholder="搜索方式" style="width: 115px">
                        <el-option label="编号" value="1" />
                        <el-option label="姓名" value="2" />
                        <el-option label="手机号" value="3" />
                    </el-select>
                </template>
            </el-input>
        </div>
        <div class="main">
            <table v-if="showTable">
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
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, index) in teacherData" :key="index">
                        <tr>
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.workid }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.age }}</td>
                            <td>{{ item.gender }}</td>
                            <td>{{ item.tel }}</td>
                            <td>{{ item.department }}</td>
                            <td>{{ item.professional }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
    // 引入请求文件
    import { request } from "@/network/request.js";
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    import { Search } from "@element-plus/icons-vue";
    import { useTestStore } from "@/store";
    const Test = useTestStore();

    // 接收输入的值
    const input = ref("");
    const select = ref("1");
    // 控制表格显示
    let showTable = ref(true);
    // 存储数据
    let teacherData = reactive([]);
    function inputChange() {
        request(
            {
                url: "searchTeacher",
                method: "post",
                data: {
                    input: input.value,
                    select: select.value,
                },
            },
            (res: any) => {
                let result = res.data;
                // 储存数据
                teacherData = result.data;
                // 重新渲染
                showTable.value = false;
                showTable.value = true;
            },
            (err: any) => {
                console.log(err);
            }
        );
    }
</script>

<style lang="less" scoped>
    // 盒子样式
    #warp {
        display: flex;
        flex-direction: column;
        // align-items: center;
        height: 100%;
        width: 100%;
        .header {
            width: 90%;
            height: 60px;
            display: flex;
            align-items: center;
            padding: 10px 10px;
        }
        .main {
            width: 100%;
            flex: 1;
        }
    }
    // 表单样式
    .input-with-select .el-input-group__prepend {
        background-color: var(--el-fill-color-blank);
    }
    .input-with-select {
        width: 70%;
    }
    // 表格样式
    table {
        border-collapse: collapse;
        width: 90%;
        margin-left: 10px;
        thead {
            th {
                border: 1px solid #ccc;
                height: 35px;
            }
        }
        tbody {
            overflow-y: scroll;
            td {
                padding: 5px 5px;
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
