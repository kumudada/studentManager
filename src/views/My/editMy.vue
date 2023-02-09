<template>
    <div id="warp">
        <el-form :model="form" label-width="120px" label-position="left">
            <!-- 用户名 -->
            <el-form-item label="用户名">
                <el-input clearable v-model="form.name" />
            </el-form-item>
            <!-- 上传头像 -->
            <el-form-item label="上传头像">
                <form action="#">
                    <label for="upload_img" class="upLoadBox">上传头像</label>
                    <input type="file" name="" @change="handleFileChange" id="upload_img" v-show="false" accept="image/jpeg,image/jpg,image/png" />
                </form>
                <img id="fileimg" style="width: 150px; height: 150px" src="#" alt="" v-show="imgActive" />
            </el-form-item>
            <!-- 个人简介 -->
            <el-form-item label="个人简介">
                <el-input
                    v-model="form.textarea"
                    maxlength="30"
                    placeholder="请输入个人简介"
                    show-word-limit
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
    // 导入官方组件
    import { useTestStore } from "@/store"; // pinia
    // 导入自定义组件
    // 引入请求文件
    import { request } from "@/network/request.js"; // axios封装
    // 引入element icon
    import { Plus } from "@element-plus/icons-vue";
    import type { UploadProps } from "element-plus";
    // 引入信息提示方法
    import showMessage from "@/hooks/showMsg.js";
    // uploadImg.vue
    import Upload from "@/components/contant/upload.vue";
    // 使用router
    const router = useRouter();
    const route = useRoute();
    const Test = useTestStore();
    function getUserData() {
        // 请求用户数据
        let token = sessionStorage.getItem("token"); //token
        request(
            {
                url: "getItem",
                method: "get",
                headers: {
                    token: token,
                },
            },
            (res: any) => {
                Test.setUser(res.data.data.user);
                sessionStorage.setItem("userData", JSON.stringify(res.data.data.user));
            },
            (err: any) => {}
        );
    }
    getUserData();
    // 表单数据
    let form = reactive({
        name: "", // 用户名
        textarea: "", // 个人简介
    });
    // 接收获得的用户信息
    let userInfo = reactive({});
    userInfo = JSON.parse(sessionStorage.getItem("userData"));
    // 赋值初始数据
    form.name = userInfo.username;
    // 提交事件
    const onSubmit = () => {
        if (form.name == "" || form.textarea == "") {
            showMessage.errMsg("请填写完整信息");
            return;
        }
        let imgUrl = sessionStorage.getItem("imgBase64");
        request(
            {
                url: "editMyInformation",
                method: "POST",
                data: {
                    id: userInfo.id,
                    name: form.name,
                    introduve: form.textarea,
                    imgUrl: imgUrl,
                },
            },
            (res: any) => {
                if (res.data.success) {
                    showMessage.successMsg("修改成功");
                    getUserData();
                } else {
                    showMessage.errMsg("服务器错误");
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    };

    // 上传头像模块
    //
    let imgActive = ref(false);
    function handleFileChange(e: any) {
        const target = e.target;
        const files = Array.from(target.files); // 注意这里取得的是一个类数组
        let file = document.querySelector("#upload_img").files[0];
        let reader = new FileReader();
        let imgFile;
        if (files) {
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                imgFile = e.target.result;
                let arr = imgFile.split(",");
                // arr[1] 就是图片的 Base64编码字符串
                // 前缀“data:image/png;base64,”对此有疑问的可以去文章底部链接了解
                let base64 = `data:image/png;base64,${arr[1]}`;
                // 存入缓存
                sessionStorage.setItem("imgBase64", base64);
                imgActive.value = true;
                document.querySelector("#fileimg").src = base64;
            };
        }
    }
</script>

<style lang="less" scoped>
    #warp {
        width: 90%;
        height: 95%;
        padding: 15px;
    }
    .upLoadBox {
        display: block;
        height: 150px;
        width: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        color: #ccc;
        margin-right: 20px;
    }
</style>
