<template>
    <div class="container" id="container" :class="{ 'right-panel-active': isActive }">
        <!-- 注册页面 -->
        <div class="form-container sign-up-container">
            <div class="form">
                <h1>创建新用户</h1>
                <input type="text" placeholder="用户名" v-model="registerInfo.userName" />
                <input type="email" placeholder="邮箱地址" v-model="registerInfo.userEmail" />
                <input type="password" placeholder="密码" @focus="infoStatus = true" @blur="infoStatus = false" v-model="registerInfo.userPassword" />
                <div v-show="infoStatus">6-18位,包括数字和字母</div>
                <input type="password" placeholder="再次输入密码" v-model="registerInfo.userConfirmPassword" />
                <button @click="register">注册</button>
            </div>
        </div>
        <!-- 登录页面 -->
        <div class="form-container sign-in-container">
            <div class="form">
                <h1>登录</h1>
                <input type="email" placeholder="邮箱地址" v-model="loginInfo.userEmail" />
                <input type="password" placeholder="密码" v-model="loginInfo.password" @focus="infoStatus = true" @blur="infoStatus = false" />
                <div v-show="infoStatus">6-18位,包括数字和字母</div>
                <a href="#" @click="recoverPasswordStatus = true">忘记密码？</a>
                <button @click="login">登录</button>
            </div>
        </div>
        <!-- 说明页面 -->
        <div class="overlay-container">
            <div class="overlay">
                <!-- 登录信息 -->
                <div class="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>为了与我们保持联系，请登录您的个人信息</p>
                    <button class="ghost" id="signIn" @click="signIn">登录</button>
                </div>
                <!-- 注册信息 -->
                <div class="overlay-panel overlay-right">
                    <h1>Hello</h1>
                    <p>即刻加入我们，开启新旅途</p>
                    <button class="ghost" id="signUp" @click="signUp">注册</button>
                </div>
            </div>
        </div>
        <teleport to="body">
            <div class="modal" v-if="recoverPasswordStatus" @click="status = false">
                <div>
                    <div class="hd">
                        <el-icon @click="recoverPasswordStatus = false"><CloseBold /></el-icon>
                    </div>
                    <section>
                        <h2>修改密码</h2>
                        <input type="email" placeholder="邮箱地址" v-model="recoverInfo.email" />
                        <input type="text" placeholder="验证码" v-model="recoverInfo.code" />
                        <button class="getCodeBtn" @click="getCode()">
                            <span v-if="getCodeStatus">发送验证码</span>
                            <span v-else>重新发送验证码（{{ codeTime }}）</span>
                        </button>
                        <input
                            type="password"
                            placeholder="请输入新密码"
                            v-model="recoverInfo.pwd"
                            @focus="infoStatus = true"
                            @blur="infoStatus = false" />
                        <div v-show="infoStatus">6-18位,包括数字和字母</div>
                    </section>
                    <button @click="recoverPwd">重置密码</button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
    import { ElMessage } from "element-plus";
    import { useTestStore } from "@/store";
    // 导入axios封装
    import { request } from "@/network/request.js";
    import { json } from "stream/consumers";
    const Test = useTestStore();

    const router = useRouter();

    // 信息提示
    // 弹出错误信息
    const errMsg = (msg: string) => {
        ElMessage({
            showClose: true,
            message: msg,
            type: "error",
        });
    };
    // 弹出正确提示
    const successMsg = (msg: string) => {
        ElMessage({
            showClose: true,
            message: msg,
            type: "success",
        });
    };
    // 控制界面
    let isActive = ref(false);

    // 邮箱格式正则
    let emailReg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
    // 密码格式验证
    // 至少八个字符，至少一个字母和一个数字：
    let passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    // 用户名格式验证
    // 用户名 2-20位，只能包含汉字/数字/字母和下划线
    let username = /^[\w\u4E00-\u9FA5]{4,20}$/;
    //
    let infoStatus = ref(false);
    // 切换登录注册
    // 点击登录
    function signIn() {
        isActive.value = false;
    }
    // 点击注册
    function signUp() {
        isActive.value = true;
    }

    // Recover the password
    // 忘记密码
    let recoverPasswordStatus = ref(false);
    // 输入数据
    let recoverInfo = reactive({
        email: "",
        code: "",
        pwd: "",
    });
    let postCode = ref("000000");
    // 验证码按钮状态控制
    let getCodeStatus = ref(true);
    let codeTime = ref(60);
    // 点击重置密码
    function recoverPwd() {
        if (recoverInfo.email == "" || recoverInfo.pwd == "" || recoverInfo.code == "") {
            errMsg("请填写完整信息");
            return;
        }
        let postCode = localStorage.getItem("code");
        // 监测用户输入的格式是否正确
        let userEmailStatus = emailReg.test(recoverInfo.email);
        let userPasswordStatus = passReg.test(recoverInfo.pwd);
        // 监测用户信息是否正确输入并提示
        if (userPasswordStatus == false) {
            errMsg("请输入正确的密码格式");
            return;
        }
        if (recoverInfo.code != postCode) {
            errMsg("验证码错误");
            return;
        }
        // 全部正确
        if (recoverInfo.code == postCode && userEmailStatus && userPasswordStatus) {
            // 发送请求
            request(
                {
                    url: "/resetPassword",
                    method: "post",
                    data: {
                        email: recoverInfo.email,
                        code: recoverInfo.code,
                        password: recoverInfo.pwd,
                    },
                },
                (res: any) => {
                    let result = res.data;
                    if (result.success) {
                        successMsg("重置密码成功");
                        setTimeout(() => {
                            recoverPasswordStatus.value = false;
                        }, 500);
                    } else {
                        errMsg("账号不存在");
                    }
                },
                (err: any) => {
                    console.log(err);
                }
            );
        }
    }
    // 点击发送验证码
    function getCode() {
        // 检查是否输入或格式是否正确

        if (recoverInfo.email == "" || !emailReg.test(recoverInfo.email)) {
            return errMsg("请输入正确的邮箱");
        }
        // 改变按钮文字倒计时
        let codeTimeout = setInterval(() => {
            codeTime.value--;
            getCodeStatus.value = false;
        }, 1000);
        setTimeout(() => {
            getCodeStatus.value = true;
            codeTime.value = 60;
            clearInterval(codeTimeout);
        }, 60000);

        if (getCodeStatus.value == true) {
            // 检查之前本地存储是否有验证码
            let haveCode = localStorage.getItem("code");
            // 没有
            if (haveCode == null) {
            } else {
                // 有 => 删除之前的
                localStorage.removeItem("code");
            }
            request(
                {
                    url: "/email",
                    method: "post",
                    data: {
                        email: recoverInfo.email,
                    },
                },
                (res: any) => {
                    let result = res.data;
                    if (result.status == 500) {
                        errMsg(result.msg);
                    }
                    if (result.status == 200) {
                        successMsg("验证码发送成功");
                    }
                    // 把返回的验证码存储到储存里
                    localStorage.setItem("code", result.code);
                },
                (err: any) => {
                    console.log(err);
                }
            );
        }
        // 60秒后清除验证码
        setTimeout(() => {
            localStorage.removeItem("code");
        }, 60000);
    }
    // 登录模块
    // 用户输入的信息
    let loginInfo = reactive({
        userEmail: "",
        password: "",
    });
    // 登录事件
    function login() {
        // 监测用户输入的格式是否正确
        let userEmailStatus = emailReg.test(loginInfo.userEmail);
        let userPasswordStatus = passReg.test(loginInfo.password);
        if (userEmailStatus && userPasswordStatus) {
            // 正确 => 发送请求
            request(
                {
                    url: "/login",
                    method: "post",
                    data: {
                        email: loginInfo.userEmail,
                        password: loginInfo.password,
                    },
                },
                (res: any) => {
                    let result = res.data;
                    if (result.success) {
                        successMsg(result.msg);
                    } else {
                        errMsg(result.msg);
                        return;
                    }
                    // 登录成功存储用户信息
                    sessionStorage.setItem("token", result.data.token);
                    sessionStorage.setItem("authority", result.data.authority);
                    Test.user = result.data;
                    router.push({
                        path: "/control",
                    });
                },
                (err: any) => {
                    console.log(err);
                }
            );
        } else {
            errMsg("请输入正确格式的邮箱与密码");
        }
    }

    // 注册模块

    // 用户输入的信息
    let registerInfo = reactive({
        userName: "",
        userEmail: "",
        userPassword: "",
        userConfirmPassword: "",
    });
    // 注册事件
    function register() {
        // 监测用户输入的格式是否正确
        let userNameStatus = username.test(registerInfo.userName);
        let userEmailStatus = emailReg.test(registerInfo.userEmail);
        let userPasswordStatus = passReg.test(registerInfo.userPassword);
        if (registerInfo.userPassword == registerInfo.userConfirmPassword) {
        } else {
            errMsg("两次输入的密码不同，请重新输入!");
        }
        if (userNameStatus && userEmailStatus && userPasswordStatus) {
            request(
                {
                    url: "/register",
                    method: "post",
                    data: {
                        userName: registerInfo.userName,
                        email: registerInfo.userEmail,
                        password: registerInfo.userPassword,
                    },
                },
                (res: any) => {
                    let result = res.data;
                    console.log(result);
                    if (result.success) {
                        successMsg(result.msg);
                        // 清除储存的验证码
                        localStorage.removeItem("code");
                    } else {
                        errMsg(result.msg);
                    }
                },
                (err: any) => {
                    console.log(err);
                }
            );
        } else {
            errMsg("请检查输入信息格式是否正确!");
        }
    }
</script>

<style lang="less" scoped>
    h1 {
        font-weight: bold;
        margin: 0;
    }

    h2 {
        text-align: center;
    }

    p {
        font-size: 14px;
        font-weight: 100;
        line-height: 20px;
        letter-spacing: 0.5px;
        margin: 20px 0 30px;
    }

    span {
        font-size: 12px;
    }

    a {
        color: #333;
        font-size: 14px;
        text-decoration: none;
        margin: 15px 0;
    }

    button {
        border-radius: 20px;
        border: 1px solid #ff4b2b;
        background-color: #ff4b2b;
        color: #ffffff;
        font-size: 12px;
        font-weight: bold;
        padding: 12px 45px;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: transform 80ms ease-in;
    }

    button:active {
        transform: scale(0.95);
    }

    button:focus {
        outline: none;
    }

    button.ghost {
        background-color: transparent;
        border-color: #ffffff;
    }

    .form {
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 50px;
        height: 100%;
        text-align: center;
    }
    .form div {
        font-size: 12px;
        color: rgb(162, 162, 162);
    }

    input {
        background-color: #eee;
        border: none;
        padding: 12px 15px;
        margin: 8px 0;
        width: 100%;
    }

    .container {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
        position: relative;
        overflow: hidden;
        width: 768px;
        max-width: 100%;
        min-height: 480px;
    }

    .form-container {
        position: absolute;
        top: 0;
        height: 100%;
        transition: all 0.6s ease-in-out;
    }

    .sign-in-container {
        left: 0;
        width: 50%;
        z-index: 2;
    }

    .container.right-panel-active .sign-in-container {
        transform: translateX(100%);
    }

    .sign-up-container {
        left: 0;
        width: 50%;
        opacity: 0;
        z-index: 1;
    }

    .container.right-panel-active .sign-up-container {
        transform: translateX(100%);
        opacity: 1;
        z-index: 5;
        animation: show 0.6s;
    }

    @keyframes show {
        0%,
        49.99% {
            opacity: 0;
            z-index: 1;
        }

        50%,
        100% {
            opacity: 1;
            z-index: 5;
        }
    }

    .overlay-container {
        position: absolute;
        top: 0;
        left: 50%;
        width: 50%;
        height: 100%;
        overflow: hidden;
        transition: transform 0.6s ease-in-out;
        z-index: 100;
    }

    .container.right-panel-active .overlay-container {
        transform: translateX(-100%);
    }

    .overlay {
        background: #ff4b2b;
        background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
        background: linear-gradient(to right, #ff4b2b, #ff416c);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 0;
        color: #ffffff;
        position: relative;
        left: -100%;
        height: 100%;
        width: 200%;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
    }

    .container.right-panel-active .overlay {
        transform: translateX(50%);
    }

    .overlay-panel {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        top: 0;
        height: 100%;
        width: 50%;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
    }

    .overlay-left {
        transform: translateX(-20%);
    }

    .container.right-panel-active .overlay-left {
        transform: translateX(0);
    }

    .overlay-right {
        right: 0;
        transform: translateX(0);
    }

    .container.right-panel-active .overlay-right {
        transform: translateX(20%);
    }

    .social-container {
        margin: 20px 0;
    }

    .social-container a {
        border: 1px solid #dddddd;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin: 0 5px;
        height: 40px;
        width: 40px;
    }
    /* 弹窗样式 */
    .modal {
        z-index: 999;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .modal > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        background-color: white;
        width: 384px;
        height: 480px;
        padding: 5px;
        border-radius: 10px;
        .hd {
            width: 100%;
            height: 30px;
            padding-right: 10px;
            i {
                float: right;
                height: 30px;
                cursor: pointer;
                color: red;
            }
        }
        section {
            height: 65%;
            width: 100%;
            padding: 0px 38px;
            text-align: center;
            div {
                font-size: 12px;
                color: rgb(140, 140, 140);
            }
            input {
                width: 83%;
            }
            .getCodeBtn {
                width: 90%;
                height: 29px;
                border-radius: 0px;
                padding: 0px;
            }
        }
    }
</style>
