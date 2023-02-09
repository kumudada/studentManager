<template>
    <div class="upload-container">
        <div class="upload-box" @click.prevent="triggerUpload" v-bind="$attrs">
            <slot name="loading" v-if="fileStatus === 'loading'">
                <button class="btn btn-primary">上传中</button>
            </slot>
            <slot name="uploaded" v-else-if="fileStatus === 'success'" :uploadedData="fileData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>
        <input type="file" class="file-input d-none" name="file" ref="uploadInput" @change="hanldeInput" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, watch } from "vue";
    import axios from "axios";
    type UploadStatus = "ready" | "loading" | "success" | "error";
    type FunctionProps = (file: File) => boolean;
    export default defineComponent({
        name: "Upload",
        inheritAttrs: false,
        props: {
            // 上传的url
            action: {
                type: String,
                required: true,
            },
            // 上传之前的校验，是一个返回布尔值的函数
            beforeUpload: {
                type: Function as PropType<FunctionProps>,
            },
            // 上传好的数据，用来判断状态或做初始化展示
            uploadedData: {
                type: Object,
            },
        },
        emits: ["file-uploaded-success", "file-uploaded-error"],
        setup(props, ctx) {
            const uploadInput = ref<null | HTMLInputElement>(null);
            const fileStatus = ref<UploadStatus>(props.uploadedData ? "success" : "ready");
            const fileData = ref(props.uploadedData);
            watch(
                () => props.uploadedData,
                (val) => {
                    if (val) {
                        fileStatus.value = "success";
                        fileData.value = val;
                    }
                }
            );
            const triggerUpload = () => {
                if (uploadInput.value) {
                    uploadInput.value.click();
                }
            };
            const hanldeInput = (e: Event) => {
                const target = e.target as HTMLInputElement;
                const files = target.files;
                console.log(target);
                if (files) {
                    const uploadFile = Array.from(files);
                    const validateFormat = props.beforeUpload ? props.beforeUpload(uploadFile[0]) : true;
                    if (!validateFormat) return;
                    fileStatus.value = "loading";
                    const formData = new FormData();
                    formData.append("file", uploadFile[0]);
                    axios
                        .post(props.action, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            console.log("文件上传成功", res);
                            fileStatus.value = "success";
                            fileData.value = res.data;
                            ctx.emit("file-uploaded-success", res.data);
                        })
                        .catch((error) => {
                            console.log("文件上传失败", error);
                            fileStatus.value = "error";
                            ctx.emit("file-uploaded-error", error);
                        })
                        .finally(() => {
                            console.log("文件上传完成");
                            if (uploadInput.value) {
                                uploadInput.value.value = "";
                            }
                        });
                }
            };

            return {
                uploadInput,
                triggerUpload,
                hanldeInput,
                fileStatus,
                fileData,
            };
        },
    });
</script>

<style lang="less" scoped></style>
