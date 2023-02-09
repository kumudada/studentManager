<template>
    <section>
        <button @click="dialogStatus = true" class="delectBtn">{{ contantData.btnText }}</button>
        <teleport to="body">
            <div class="modal" :class="{ Masking: Masking }" v-if="dialogStatus">
                <div>
                    <div class="hd">
                        <div class="title">{{ contantData.title }}</div>
                        <div class="icon">
                            <el-icon @click="dialogStatus = false"><CloseBold /></el-icon>
                        </div>
                    </div>
                    <section>
                        {{ contantData.content }}
                    </section>
                    <div class="btn" v-if="btnStatus">
                        <button class="fil" @click="failure">取消</button>
                        <button class="success" @click="success">确定</button>
                    </div>
                </div>
            </div>
        </teleport>
    </section>
</template>

<script setup lang="ts">
    // 接收传入的值
    const props = defineProps({
        // 这里接收相同名称的值
        // 接收自定义数据
        data: Object,
        // 显示状态
        dialogStatus: {
            type: Boolean,
            default: false,
        },
        // 是否显示背后遮罩
        Masking: {
            type: Boolean,
            default: true,
        },
        btnStatus: {
            type: Boolean,
            default: true,
        },
    });
    // 获取自定义内容
    let contantData = reactive(props.data as Object);
    // 获取盒子是否显示的变量
    let dialogStatus = ref(props.dialogStatus);
    // 是否显示遮罩层
    let Masking = ref(props.Masking);
    // 是否显示按钮区域
    let btnStatus = ref(props.btnStatus);

    // 按钮抛出emit
    // setup语法糖 子组件Emits传值
    const emit = defineEmits(["confim"]);
    const success = () => {
        //emit(父组件中的自定义方法,参数一,参数二,...)
        emit("confim", true);
        dialogStatus.value = false;
    };
    const failure = () => {
        emit("confim", false);
        dialogStatus.value = false;
    };
</script>

<style lang="less" scoped>
    /* 弹窗样式 */
    .delectBtn {
        border: 0;
        padding: 5px 10px;
        color: #fff;
        background-color: rgb(247, 45, 45);
        border-radius: 5px;
    }
    .modal {
        z-index: 999;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .Masking {
        background-color: rgba(0, 0, 0, 0.5);
    }
    .modal > div {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        background-color: white;
        min-width: 350px;
        max-width: 450px;
        line-height: 30px;
        padding: 5px;
        border-radius: 10px;
        border: 1px solid rgb(173, 173, 173);
        background-color: rgb(248, 248, 248);
        .hd {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 30px;
            padding-right: 10px;
            .title {
                flex: 1;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            i {
                float: right;
                height: 30px;
                cursor: pointer;
                color: red;
            }
        }
        section {
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }
        .btn {
            width: 100%;
            height: 45px;
            display: flex;
            justify-content: right;
            align-items: center;
            .fil {
                border: 0;
                padding: 5px 10px;
                color: #fff;
                background-color: rgb(247, 45, 45);
                border-radius: 5px;
                margin-right: 20px;
            }
            .success {
                border: 0;
                padding: 5px 10px;
                color: #fff;
                background-color: rgb(82, 194, 239);
                border-radius: 5px;
                margin-right: 20px;
            }
        }
    }
</style>
