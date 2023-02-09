var express = require("express");
var router = express.Router();
let fs = require("fs");
let path = require("path");
let formidable = require("formidable");
// 引入数据库
let db = require("../db/sql");
// 引入token
let jwt = require("jsonwebtoken");
const usersql = require("../db/usersql.js");
// 引入发送邮件的模块
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const { abort } = require("process");
// import nodeMail from "./nodemailer.js";
// 引入教师信息处理函数
const teacherHandler = require("../router_handler/teacherHandler.js");
// 引入班级信息处理函数
const classHandler = require("../router_handler/classHandler.js");

const authorityHandler = require("../router_handler/authorityHandler.js");

/* GET home page. */
// 测试主页
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
    next();
});
// 测试
router.get("/api/test", function (req, res, next) {
    res.send({
        code: 200,
        success: true,
        msg: "成功",
    });
});

/**
 * 存储文件方法
 */
function saveFile(file, callback) {
    // 定义存储文件地址
    let savePath = path.resolve(__dirname, `../public/images/${file.name}`);
    let sourcePath = file.path;
    // 创建读写流
    let readStream = fs.createReadStream(sourcePath);
    let writeStream = fs.createWriteStream(savePath);
    // 读写进程开始
    readStream.pipe(writeStream);
    // 监听读取完成事件
    readStream.on("end", () => {
        // 读取完成后，释放读取源文件链接
        fs.unlinkSync(sourcePath);
        callback();
    });
}

// 登录
router.post("/api/login", function (req, res, next) {
    // 获取数据
    let email = req.body.email;
    let password = req.body.password;
    // 用户信息
    let payload = { email: email };
    // 口令
    let secret = "lijiale";
    // 生成token
    let token = jwt.sign(payload, secret, { expiresIn: "2h" });
    let params = {
        email: email,
        token: token,
    };
    db.query(`SELECT * FROM user WHERE email = "${email}" AND pwd = "${password}"`, (results, errors) => {
        if (errors != null && errors.length) {
            db.query(`SELECT * FROM user WHERE email = '${email}'`, (result, err) => {
                // 登录更新token
                db.query(usersql.updateToken(params), (r, e) => {
                    res.send({
                        code: 200,
                        success: true,
                        msg: "登录成功",
                        data: {
                            userid: err[0].id,
                            username: err[0].username,
                            email: err[0].email,
                            pwd: err[0].pwd,
                            token: err[0].token,
                            imgUrl: err[0].imgUrl,
                            authority: err[0].authority,
                        },
                    });
                });
            });
        } else {
            res.send({
                code: 300,
                success: false,
                msg: "账号不存在,请注册",
            });
        }
    });
});

// 注册
router.post("/api/register", (req, res, next) => {
    // 获取数据
    let userName = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;

    db.query(`SELECT * FROM user WHERE email = '${email}'`, (results, errors) => {
        if (errors != null && errors.length) {
            res.send({
                code: 200,
                success: false,
                msg: "邮箱已存在",
            });
        } else {
            // 引入token
            let jwt = require("jsonwebtoken");
            // 用户信息
            let payload = { email: email };
            // 口令
            let secret = "lijiale";
            // 生成token
            let token = jwt.sign(payload, secret, { expiresIn: "2h" });
            let imgUrl = `http://127.0.0.1:5173/public/images/user.jpeg`; // 默认头像
            const introduce = `该用户很懒，暂未设置简介`; // 默认简介内容
            let authority = "ordinary"; // 默认权限
            db.query(
                `insert into user(username,email,pwd,token,imgUrl,authority,introduce) values("${userName}","${email}","${password}","${token}","${imgUrl}","${authority}",'${introduce}')`,
                (result, error) => {
                    res.send({
                        code: 200,
                        success: true,
                        msg: "注册成功",
                    });
                }
            );
        }
    });
});

// 重置密码
router.post("/api/resetPassword", (req, res) => {
    // 获取前端传入的input
    const email = req.body.email;
    const code = req.body.code;
    const newPassword = req.body.password;
    // 查询数据库
    db.query(`SELECT * FROM user WHERE email = '${email}'`, (error, result) => {
        if (result.length) {
            // 更改密码
            db.query(`UPDATE user SET pwd = "${newPassword}" WHERE useremail = "${email}"`, (err, resu) => {
                res.send({
                    status: 200,
                    msg: "密码修改成功",
                    success: true,
                });
            });
        } else {
            res.send({
                status: 300,
                success: false,
                msg: "该账号不存在,请注册账号",
            });
        }
    });
});

// 发送验证码
router.post("/api/email", async (req, res) => {
    // 获取前端传入的input
    const email = req.body.email;
    // 生成随机验证码函数 及 邮箱验证正则
    const randomFns = () => {
        // 生成6位随机数
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += parseInt(Math.random() * 10);
        }
        return code;
    };
    const code = randomFns();
    const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //验证邮箱正则
    //发送邮件
    let nodeMail = nodemailer.createTransport({
        service: "163", //类型163邮箱
        port: 465, // smtp端口 默认无需改动
        secure: true, //上文获取的secure
        auth: {
            user: "a3066684712@163.com", // 用户名
            pass: "YJEBFROVYOJIQURE", // SMTP授权码
        },
    });
    const mail = {
        from: `"落梦科技"<a3066684712@163.com>`, // 发件人
        subject: "验证码", //邮箱主题
        to: email, //收件人，这里由post请求传递过来
        // 邮件内容，用html格式编写
        html: `
        <p>您好！</p>
        <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
        <p>如果不是您本人操作，请无视此邮件</p>
    `,
    };
    await nodeMail.sendMail(mail, (err, info) => {
        if (!err) {
            res.send({
                status: 200,
                msg: "验证码发送成功",
                code: code,
            });
        } else {
            res.json({
                status: 500,
                msg: "验证码发送失败，请稍后重试",
            });
        }
    });
});

// 根据token获取用户数据
router.get("/api/getItem", (req, res) => {
    // 获取传入的token
    let token = req.headers.token;
    // 解密
    let email = jwt.decode(token).email;
    db.query(`SELECT * FROM user WHERE email = '${email}'`, (results, error) => {
        res.send({
            code: 200,
            success: true,
            data: {
                user: error[0],
            },
        });
    });
});

// 查询学生表
router.get("/api/getStudent", (req, res) => {
    db.query(`SELECT * FROM studentinfo`, (error, results) => {
        // console.log(results);
        res.send({
            code: 200,
            success: true,
            data: results,
        });
    });
});

// 获取教师列表
router.get("/api/getTeacherList", (req, res) => {
    db.query(`SELECT name FROM teacher`, (error, result) => {
        res.send({
            code: 200,
            success: true,
            data: result,
        });
    });
});

// 获取专业列表
router.get("/api/getMajorData", (req, res) => {
    db.query(`SELECT * FROM major`, (error, result) => {
        res.send({
            code: 200,
            success: true,
            data: result,
        });
    });
});
// 获取班级列表
router.get("/api/getClassData", (req, res) => {
    db.query(`SELECT class FROM classes`, (error, result) => {
        res.send({
            code: 200,
            success: true,
            data: result,
        });
    });
});

// 删除学生数据
router.post("/api/delectStudent", (req, res) => {
    let stuNumber = req.body.stuNumber;
    db.query(`DELETE FROM studentinfo WHERE stuNumber = ${stuNumber}`, (results, errors) => {
        res.send({
            code: 200,
            success: true,
            msg: "删除成功",
        });
    });
});

// 更改学生数据
router.post("/api/editStudent", (req, res) => {
    let parmas = req.body;
    // 更新学生数据
    db.query(usersql.updataStudent(parmas), (result, error) => {
        res.send({
            code: 200,
            success: true,
            msg: "修改成功",
        });
    });
});

// 添加学生数据
router.post("/api/addStudentData", (req, res) => {
    let parmas = req.body; // 获取传入的数据
    db.query(`SELECT * FROM studentinfo WHERE stuNumber = '${parmas.stuNumber}'`, (error, result) => {
        if (result[0]) {
            res.send({
                code: 200,
                success: false,
                msg: "该学生已存在",
            });
        } else {
            db.query(usersql.addStudent(parmas), (errors, results) => {
                res.send({
                    code: 200,
                    success: true,
                    msg: "添加成功",
                });
            });
        }
    });
});

// 查询学生数据
router.post("/api/searchStudent", (req, res) => {
    let parmas = req.body;
    db.query(usersql.searchStudent(parmas), (errors, results) => {
        res.send({
            code: 200,
            success: true,
            data: results,
        });
    });
});

// 获取教师全部信息
router.get("/api/getTeacherData", teacherHandler.getTeacherData);
// 删除教师信息
router.post("/api/deleteTeacher", teacherHandler.deleteTeacher);
// 获取部门列表
router.get("/api/getDepartment", teacherHandler.getDepartment);
// 获取职称列表
router.get("/api/getProfessional", teacherHandler.getProfessional);
// 更新教师信息
router.post("/api/updateTeacher", teacherHandler.updateTeacher);
// 添加教师消息
router.post("/api/addTeacher", teacherHandler.addTeacher);
// 搜索教师信息
router.post("/api/searchTeacher", teacherHandler.searchTeacher);

// 班级信息模块
// 获取全部班级信息
router.get("/api/getClass", classHandler.getClass);
// 删除班级信息
router.post("/api/delClass", classHandler.delClass);
// 搜索班级信息
router.post("/api/searchClass", classHandler.searchClass);
// 获取学院信息
router.get("/api/getCollegeList", classHandler.getCollegeList);
// 添加班级信息
router.post("/api/addClassData", classHandler.addClassData);
// 更新班级信息
router.post("/api/updateClassData", classHandler.updateClassData);

// 修改个人信息
router.post("/api/editMyInformation", function (req, res, next) {
    let parmas = req.body;
    db.query(
        `update user set username = '${parmas.name}',introduce = '${parmas.introduve}',imgUrl = '${parmas.imgUrl}' where id = ${parmas.id}`,
        (error, result) => {
            if (error) {
                res.send({
                    code: 500,
                    success: false,
                    msg: "服务器错误",
                });
            } else {
                res.send({
                    code: 200,
                    success: true,
                    msg: "修改成功",
                });
            }
        }
    );
});

// 权限管理
router.post("/api/userData", authorityHandler.userData);
// 更改权限
router.post("/api/change_authority",authorityHandler.change_authority);
module.exports = router;
