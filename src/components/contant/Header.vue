<template>
    <div class="contant-hd">
        <div class="contant typing">
            {{ props.day }}
        </div>
        <div class="user">
            <img :src="props.imgUrl" alt="" />
            <span>{{ props.text }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
    const props = defineProps({
        // 这里接收相同名称的值
        imgUrl: String,
        text: String,
        day: String,
    });
</script>

<style lang="less" scoped>
    .contant-hd {
        height: 100%;
        width: 100%;
        display: flex;
        .contant {
            flex: 1;
            height: 55px;
            font-size: 17px;
            line-height: 55px;
            padding-left: 15px;
            font-family: "楷体";
        }
        .user {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // width: 81px;
            height: 100%;
            padding: 0px 16px;
            
            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }
        }
    }

    .typing {
        color: rgb(0, 0, 0);
        font-size: 2em;
        width: 21em;
        height: 1.5em;
        border-right: 1px solid transparent;
        animation: typing 2s steps(42, end), blink-caret 0.75s step-end infinite;
        font-family: Consolas, Monaco;
        word-break: break-all;
        overflow: hidden;
    }
    /* 打印效果 */
    @keyframes typing {
        from {
            width: 0;
        }

        to {
            width: 21em;
        }
    }

    /* 光标 */
    @keyframes blink-caret {
        from,
        to {
            border-color: transparent;
        }

        50% {
            border-color: currentColor;
        }
    }
</style>
