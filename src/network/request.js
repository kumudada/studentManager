import axios from "axios";
import router from "@/router";
import { ElLoading } from "element-plus";

let loadingInstance = "";
export function request(config, success, error) {
    // 创建一个axios实例
    const instance = axios.create({
        baseURL: "http://127.0.0.1:3007/api",
        timeout: 3000,
    });
    // 添加请求拦截器
    instance.interceptors.request.use(
        function (config) {
            // 在发送请求之前做些什么
            // 如果没有token转到登录界面
            if (sessionStorage.getItem("token") != null) {
            } else {
                function GoLogin() {
                    router.push("/user/login");
                }
                GoLogin();
                return config;
            }
            return config;
        },
        function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        }
    );
    // 添加响应拦截器
    instance.interceptors.response.use(
        function (response) {
            // 2xx 范围内的状态码都会触发该函数。
            // 对响应数据做点什么
            return response;
        },
        function (error) {
            // 超出 2xx 范围的状态码都会触发该函数。
            // 对响应错误做点什么
            // console.log("响应错误");
            return Promise.reject(error);
        }
    );

    instance(config)
        .then((res) => {
            success(res);
        })
        .catch((err) => {
            error(err);
        });
}
