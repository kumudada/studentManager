import { ElMessage } from "element-plus";
// 信息提示
let showMsg = {
    // 弹出错误信息
    errMsg(msg) {
        ElMessage({
            showClose: true,
            message: msg,
            type: "error",
        });
    },
    successMsg(msg) {
        ElMessage({
            showClose: true,
            message: msg,
            type: "success",
        });
    },
};
export default showMsg;
