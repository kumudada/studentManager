<template>
    <div class="wrap">
        <div class="hd">
            <div class="left">
                <img :src="Test.user.imgUrl" alt="" />
            </div>
            <div class="right">
                <p>用户：{{ user.username }}</p>
                <p>
                    权限：
                    <span class="user back" v-if="authority == 'root'">管理员</span>
                    <span class="user" v-else>普通用户</span>
                </p>
            </div>
        </div>
        <div class="bd">
            <a href="javascript:;" @click="exitLogin()"> 退出登录 </a>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { request } from "@/network/request.js";
    import { useTestStore } from "@/store";
    const Test = useTestStore();
    const router = useRouter();
    const props = defineProps({
        // 这里接收相同名称的值
        info: Object,
    });
    let user = props.info;
    let authority = sessionStorage.getItem("authority");
    // 退出登录
    function exitLogin() {
        if (sessionStorage.getItem("token")) {
            sessionStorage.removeItem("token");
            router.push("/user/login");
        } else {
            return;
        }
    }
</script>

<style lang="less" scoped>
    .user {
        padding: 2px 5px;
        border: 1px solid #000;
        border-radius: 5px;
        color: rgb(255, 255, 255);
        background-color: #3d47ff;
    }
    .back {
        background-color: green;
    }
    .wrap {
        height: 250px;
        width: 350px;
        border-radius: 10px;
        padding: 5px;
        background-color: #747bff30;
        box-shadow: 3px 3px 8px 1px rgb(237, 237, 237);
        // background-color: #5159f4;
        .hd {
            display: flex;
            width: 100%;
            height: 75%;
            .left {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 150px;
                    height: 150px;
                    border-radius: 8px;
                    border: 1px solid rgb(129, 129, 129);
                }
            }
            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 20px;
                // align-items: center;
                p {
                    font-size: 1.25em;
                    margin: 5px 0px;
                    color: rgb(63, 62, 62);
                }
            }
        }
        .bd {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 25%;
            text-align: center;
            a {
                display: block;
                height: 35px;
                width: 65px;
                border: 2px solid #535bf2;
                background-color: #535bf2;
                color: #fff;
                font-size: 12px;
                line-height: 35px;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.3s;
                cursor: pointer;
                &:hover {
                    color: #535bf2;
                    background-color: #fff;
                }
            }
        }
    }
</style>
