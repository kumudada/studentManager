<template>
    <div id="container">
        <!-- 左侧导航栏收起功能 -->
        <div class="collapseGetBox" @click="changeNavActive">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
                <path
                    fill="currentColor"
                    d="M640 384v256H384V384h256zm64 0h192v256H704V384zm-64 512H384V704h256v192zm64 0V704h192v192H704zm-64-768v192H384V128h256zm64 0h192v192H704V128zM320 384v256H128V384h192zm0 512H128V704h192v192zm0-768v192H128V128h192z"></path>
            </svg>
        </div>
        <!-- 左导航栏 -->
        <div class="left-nav" :class="{ navActive: navActive }">
            <LeftNav></LeftNav>
        </div>
        <!-- 右侧内容区 -->
        <div class="main">
            <div class="contant-hd">
                <Header :imgUrl="Test.user.imgUrl" :text="Test.user.username" :day="daySay"> </Header>
            </div>
            <div class="contant-bd">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    // 引入请求文件
    import { request } from "@/network/request.js";
    // 引入组件
    import LeftNav from "@/components/contant/LeftNav.vue"; // 左侧导航栏
    import Header from "@/components/contant/Header.vue";
    import { useTestStore } from "@/store";
    

    const Test = useTestStore();
    // 使用router
    const router = useRouter();
    const route = useRoute();
    // console.log(getUserData);
    // console.log("setup");
    // 请求用户数据
    let token = sessionStorage.getItem("token");
    request(
        {
            url: "getItem",
            method: "get",
            headers: {
                token: token,
            },
        },
        (res: any) => {
            let userInfo = res.data.data.user;
            Test.user = userInfo;
        },
        (err: any) => {}
    );

    // let userC = getUserData();
    // 每日一言
    let daySay = ref("");
    let getText = () => {
        request(
            {
                url: "https://v.api.aa1.cn/api/api-wenan-wangyiyunreping/index.php?aa1=json",
                method: "get",
            },
            (res: any) => {
                daySay.value = res.data[0].wangyiyunreping;
            },
            (err: any) => {
                console.log(err);
            }
        );
    };
    getText();
    let navActive = ref(false);
    //
    function changeNavActive() {
        console.log("触达");
        navActive.value = !navActive.value;
    }
</script>

<style scoped lang="less">
    // 整体布局
    #container {
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        display: flex;
        // 收起导航栏的按钮
        .collapseGetBox {
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 90%;
            left: 10px;
            width: 25px;
            height: 25px;
            border-radius: 5px;
            border: 1px solid #000;
            transition: all 0.3s;
            padding: 5px;
            &:hover {
                color: #fff;
                background-color: rgb(134, 134, 134);
            }
            // background-color: pink;
        }
        .navActive {
            margin-left: -200px;
        }
        // 左nav
        .left-nav {
            width: 201px;
            height: 100%;
            // background-color: pink;
            border-right: 1px solid grey;
            overflow: hidden;
            transition: all 0.3s;
        }
        // 内容
        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            .contant-hd {
                width: 100%;
                height: 55px;
                border-bottom: 1px solid rgb(188, 188, 188);
            }
            .contant-bd {
                flex: 1;
                overflow: auto;
                background-color: #fff;
            }
        }
    }
    ::-webkit-scrollbar {
        width: 6px;
    }

    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: inherit;
        background-color: rgba(144, 147, 153, 0.3);
        -webkit-transition: 0.3s background-color;
        transition: 0.3s background-color;
    }
</style>
