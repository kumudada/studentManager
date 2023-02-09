// 导入db模块
const db = require("../db/sql");
// 导入express模块
const express = require("express");

const sql = require("../db/usersql");
// 获取教师信息
exports.getTeacherData = (req, res) => {
    db.query("select * from teacher", (error, result) => {
        if (error) {
            console.log(error);
            res.send({
                code: 500,
                msg: "服务器错误",
            });
        } else {
            res.send({
                code: 200,
                success: true,
                msg: "获取成功",
                data: result,
            });
        }
    });
};
// 删除教师信息
exports.deleteTeacher = (req, res) => {
    let id = req.body.id;
    db.query(`DELETE FROM teacher WHERE id = ${id}`, (error, result) => {
        if (result.affectedRows) {
            res.send({
                code: 200,
                success: true,
                msg: "删除成功",
            });
        } else {
            res.send({
                code: 300,
                success: false,
                msg: "删除失败",
            });
        }
    });
};

exports.getDepartment = (req, res) => {
    db.query(`SELECT * FROM department`, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send({
                code: 200,
                success: true,
                data: result,
            });
        }
    });
};
// 获得职称列表
exports.getProfessional = (req, res) => {
    db.query(`SELECT * FROM professional`, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send({
                code: 200,
                success: true,
                data: result,
            });
        }
    });
};
// 更改教师信息
exports.updateTeacher = (req, res) => {
    const params = req.body;
    db.query(sql.updateTeacher(params), (error, results) => {
        if (error) {
            console.log(error);
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
    });
};

// 添加教师信息
exports.addTeacher = (req, res) => {
    const parmas = req.body;
    db.query(`select * from teacher where workid = '${parmas.workid}'`, (error, result) => {
        if (result == []) {
            db.query(sql.addTeacher(parmas), (err, resu) => {
                res.send({
                    code: 200,
                    success: true,
                    msg: "添加成功",
                });
            });
        } else {
            res.send({
                code: 300,
                success: false,
                msg: "请勿重复添加",
            });
        }
    });
};
// 搜索教师信息
exports.searchTeacher = (req, res) => {
    const params = req.body;
    console.log(req.body);
    db.query(sql.searchTeacher(params), (error, result) => {
        if (error) {
            console.log(error);
            res.send({
                code: 500,
                success: false,
                msg: "服务器错误",
            });
        } else {
            res.send({
                code: 200,
                success: true,
                msg: "查询成功",
                data: result,
            });
        }
    });
};
