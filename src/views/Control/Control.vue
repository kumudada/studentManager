<template>
    <div class="control">
        <!-- <showInfo
            :info="Test.user"
            data-tilt
            class="box_card"
            data-tilt-perspective="800"
            data-tilt-transition="true"
            data-tilt-glare="true"></showInfo> -->
        <showInfo :info="Test.user"></showInfo>
    </div>
</template>

<script setup lang="ts">
    // 引入组件
    import showInfo from "@/components/contant/Control/userInfo.vue";
    //引入获取用户数据的hook
    import getUserData from "@/hooks/getUserData.js";
    // 引入请求文件
    import { request } from "@/network/request.js";
    import { onBeforeMount } from "vue";
    import { useTestStore } from "@/store";
    import VanillaTilt from "vanilla-tilt";

    onMounted(() => {
        VanillaTilt.init(document.querySelectorAll(".box_card"));
    });
    const Test = useTestStore();

    // console.log(getUserData);
    const route = useRoute();
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
</script>

<style lang="less" scoped>
    .control {
        padding: 10px;
    }
</style>
