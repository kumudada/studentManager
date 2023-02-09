import { request } from "@/network/request.js";
import { useTestStore } from "@/store";
const Test = useTestStore();

export default function(): object{
    let userC = reactive({
        email: "",
        id: "",
        imgUrl: "",
        username: "",
        authority: "",
    });
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
        (res) => {
            let userInfo = res.data.data.user;
            Test.user = userInfo;
            let { email, id, imgUrl, pwd, username, authority } = userInfo;
            // 储存数据
            userC.email = email;
            userC.id = id;
            userC.imgUrl = imgUrl;
            userC.username = username;
            userC.authority = authority;
        },
        (err) => {}
    );
    
}

