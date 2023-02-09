// 导入db模块
const db = require("../db/sql");
// 导入express模块
const express = require("express");

const sql = require("../db/usersql");

exports.userData = (req, res) => {
    const parmas = req.body;
    db.query(sql.userData(parmas), (error, result) => {
        if (error) {
            res.send({
                code: 500,
                success: false,
                msg: "服务器错误",
            });
        }
        res.send({
            code: 200,
            success: true,
            msg: "搜索成功",
            data: result,
        });
    });
};

exports.change_authority = (req, res) => {
    const parmas = req.body;
    db.query(`update user set username = '${req.body.user}',authority = '${req.body.region}' where id = ${req.body.userid}`, (error, result) => {
        if (error) {
            res.send({
                code: 400,
                success: false,
                msg: "Error!",
            });
            return;
        }
        res.send({
            code: 200,
            success: true,
            msg: "Success",
        });
    });
};
