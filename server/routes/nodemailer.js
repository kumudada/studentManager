const nodemailer = require("nodemailer");

let nodeMail = nodemailer.createTransport({
    service: "163", //类型163邮箱
    port: 465, // smtp端口 默认无需改动
    secure: true, //上文获取的secure
    auth: {
        user: "a3066684712@163.com", // 用户名
        pass: "YJEBFROVYOJIQURE", // SMTP授权码
    },
});

module.export = nodeMail;
