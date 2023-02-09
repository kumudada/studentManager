// 导入db模块
const db = require("../db/sql");
// 导入express模块
const express = require("express");

const sql = require("../db/usersql");
// 获取班级数据
exports.getClass = (req, res) => {
    db.query(`select * from classes`, (errors, results) => {
        if (errors) {
            res.send({
                code: 500,
                success: false,
                msg: "服务器错误",
            });
        } else {
            res.send({
                code: 200,
                success: true,
                data: results,
            });
        }
    });
};
// 删除班级数据
exports.delClass = (req, res) => {
    db.query(`delete from classes where id =?`, [req.body.id], (errors, results) => {
        if (errors) {
            res.send({
                code: 500,
                success: false,
                msg: "服务器错误",
            });
        } else {
            res.send({
                code: 200,
                success: true,
                msg: "删除成功",
            });
        }
    });
};

// 搜索班级数据
exports.searchClass = (req, res) => {
    // 将select转换为int
    req.body.select._value = Number(req.body.select._value);
    // 存储数据
    let parmas = { input: req.body.input._value, select: req.body.select._value };
    db.query(sql.searchClass(parmas), (error, result) => {
        if (error) {
            res.send({
                code: 500,
                success: false,
                msg: "服务器错误",
            });
            return;
        } else {
            res.send({
                code: 200,
                success: true,
                data: result,
            });
        }
    });
};

exports.getCollegeList = (req, res) => {
    db.query("select * from college", (error, result) => {
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
                data: result,
            });
        }
    });
};

// 添加班级数据
exports.addClassData = (req, res) => {
    let parmas = req.body;
    // 查询是否重复添加
    db.query(`select * from classes where class = '${parmas.class}'`, (err, resu) => {
        if (resu[0]) {
            res.send({
                code: 300,
                success: false,
                msg: "该班级已存在",
            });
            return;
        } else {
            // 添加数据
            db.query(sql.addClass(parmas), (error, result) => {
                if (error) {
                    res.send({
                        code: 500,
                        success: false,
                        msg: "服务器错误",
                    });
                    return;
                }
                res.send({
                    code: 200,
                    success: true,
                    msg: "添加成功",
                });
            });
        }
    });
};
// 更新班级信息
exports.updateClassData = (req, res) => {
    let params = req.body;
    console.log(params);
    // 更新数据
    db.query(sql.updateClassData(params), (err, result) => {
        if (err) {
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
