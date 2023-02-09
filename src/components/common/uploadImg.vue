<template>
     <button class="upLoad">上传图片</button>
</template>

<script setup>
// 1.创建一个input
let input = document.createElement('input');
        input.type = 'file';
        // 2.获取上传按钮
        let btn = document.getElementsByClassName('upLoad')[0];
        // 3.按钮点击事件
        btn.addEventListener('click', function () {
            input.click()
        })
        // 4.input监听
        input.addEventListener('change', function (e) {
            // e.target.files 图片的信息
            console.log(e.target.files);
            // 获取图片的url
            let url = URL.createObjectURL(e.target.files[0]);
            // 创建一个img对象
            let img = new Image();
            // 路径为上传的url
            img.src = url;
            // 添加dom元素
            // document.body.removeChild(img);
            document.body.appendChild(img);
            console.log(img);
        })
</script>

<style lang="less" scoped>
.upLoad {
            cursor: pointer;
            padding: 10px;
            outline: none;
            border: 1px solid #ccc;
            border-radius: 5px;
            transition: all 0.3s;
        }

        .upLoad:hover {
            background-color: rgb(33, 47, 237);
            color: #fff;
        }

        img {
            height: 100%;
            width: 100%;
        }
</style>