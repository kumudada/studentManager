<template>
    <div v-wechat-title="route.meta.title">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { request } from "@/network/request.js";
    const route = useRoute();
    function getMarginZ() {
        document.querySelector("body").setAttribute("style", "margin:0;");
    }
    getMarginZ();
</script>
<style scoped>
    @import url(./style.css);
</style>
