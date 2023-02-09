<template>
    <Login class="container"></Login>
</template>

<script setup>
    import Login from "@/components/Login.vue";
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }
    body {
        background: #f6f5f7;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: "Montserrat", sans-serif;
    }
    .container {
        margin-top: 9%;
        margin-left: 25%;
    }
</style>
