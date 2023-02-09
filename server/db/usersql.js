// 验证数据库中的用户
const user = {
    // 查询用户手机号
    queryUserTell(option) {
        return "select * from user where tel = " + option.userTel + "";
    },
    // 更新token
    updateToken(option) {
        return `update user set token = '${option.token}' where email = '${option.email}'`;
    },
    // 更改学生信息
    updataStudent(option) {
        return `update studentinfo set stuNumber = '${option.number}', name = '${option.name}',sex = '${option.gender}',age = '${option.age}',grade = '${option.reged}',class=' ${option.class}',major = '${option.major}',province ='${option.province}',city = '${option.city}' WHERE id = ${option.id}`;
    },
    // 添加学生信息
    addStudent(option) {
        return `insert into studentinfo(stuNumber,name,sex,age,tel,class,grade,major,city,province,teacher) values('${option.stuNumber}','${option.name}','${option.sex}','${option.age}','${option.tel}','${option.class}','${option.grade}','${option.major}','${option.city}','${option.province}','${option.manager}')`;
    },
    // 搜索学生信息
    searchStudent(option) {
        // 使用学号查询
        if (option.select == "1") {
            return `select * from studentinfo where stuNumber like '%${option.input}%'`;
        }
        // 使用手机号查询
        if (option.select == "3") {
            return `select * from studentinfo where tel like '%${option.input}%'`;
        }
        // 使用姓名查询
        if (option.select == "2") {
            return `select * from studentinfo where name like '%${option.input}%'`;
        }
    },
    // 更改教师信息
    updateTeacher(option) {
        return `UPDATE teacher SET workid = '${option.number}',name = '${option.name}',age = '${option.age}',gender = "${option.gender}",tel = "${option.tel}",department = "${option.department}",professional = "${option.professional}" WHERE id = ${option.id}`;
    },
    // 添加教师信息
    addTeacher(option) {
        return `insert into teacher(workid,name,age,gender,tel,department,professional) values('${option.workid}','${option.name}','${option.age}','${option.gender}','${option.tel}','${option.department}','${option.professional}'`;
    },
    // 搜索教师信息
    searchTeacher(option) {
        // 使用编号搜素
        if (option.select == "1") {
            return `select * from teacher where workid like '%${option.input}%'`;
        }
        // 使用姓名搜素
        if (option.select == "2") {
            return `select * from teacher where name like '%${option.input}%'`;
        }
        // 使用手机号搜素
        if (option.select == "3") {
            return `select * from teacher where tel like '%${option.input}%'`;
        }
    },
    // 搜索班级信息
    searchClass(option) {
        // 全部班级
        if (option.select == 1) {
            return `select * from classes`;
        }
        // 班级名称
        if (option.select == 2) {
            return `select * from classes where class like '%${option.input}%'`;
        }
        // 负责导师
        if (option.select == 3) {
            return `select * from classes where manager like '%${option.input}%'`;
        }
        // 专业名称
        if (option.select == 4) {
            return `select * from classes where major like '%${option.input}%'`;
        }
    },
    // 添加新的班级数据
    addClass(option) {
        return `insert into classes(class,manager,major,college) values('${option.class}','${option.manager}','${option.major}','${option.college}')`;
    },
    // 更新班级数据
    updateClassData(option) {
        return `update classes set class = '${option.class}',manager = '${option.manager}',major = '${option.major}',college = '${option.college}' where id = '${option.id}'`;
    },
    // 搜索用户数据
    userData(option) {
        if (option.select == "1") {
            return `select * from user`;
        }
        if (option.select == "2") {
            return `select * from user  where username like '%${option.input}%'`;
        }
        if (option.select == "3") {
            return `select * from user where email like '%${option.input}%'`;
        }
    },
};
exports = module.exports = user;
