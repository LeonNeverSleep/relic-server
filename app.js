const express = require("express");
const app = express()
const db = require('./mysql.js')
const jws = require('./jws.js');
app.use(express.json())
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const bodyParser = require('body-parser');
//配置静态资源文件
app.use(express.static(__dirname + "/public"));
// 配置静态资源目录 整一个文件夹 通过域名能访问
// app.use(express.static(path.join(__dirname, "../static")))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(multer({ dest: '/tmp/' }).array('file'));
/* 用户增删改查begin */
//显示所有用户
app.get('/users', function (req, res, next) {
    db.querySql("select * from users", [], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
//查找
app.get('/user', function (req, res, next) {
    db.querySql("select * from users where id=?", [req.query.id], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
//新增管理员
app.post('/reg', function (req, res, next) {
    console.log(req.body);
    let name = req.body.data.name
    let password = req.body.data.password
    let address = req.body.data.address
    let phone = req.body.data.phone
    let identity = req.body.data.authority
    let sql = `INSERT INTO users ( name,password,phone,address,identity ) VALUES ( '${name}','${password}','${phone}','${address}','${identity}' )`
    db.querySql(sql, [], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
//删除
app.post('/user/del', function (req, res, next) {
    let id = req.body.data.id
    let sql = `delete from users where id=?`
    db.querySql(sql, [id], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});

//编辑用户信息
app.post('/edit', function (req, res, next) {
    let id = req.body.data.id
    let name = req.body.data.name
    let address = req.body.data.address
    let phone = req.body.data.phone
    let sql = `UPDATE users SET name=?,address=?,phone=? where id=?`
    db.querySql(sql, [name, address, phone, id], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    })
});
//修改个人信息
app.post('/editUserData', function (req, res, next) {
    let name = req.body.data.name
    let address = req.body.data.address
    let phone = req.body.data.phone
    let password = req.body.data.password
    let sql = `UPDATE users SET address=?,phone=?,password=? where name=?`
    db.querySql(sql, [address, phone, password, name], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    })
});
// jwt鉴权
app.post('/login', function (req, res, next) {
    const name = req.body.data.name;
    const pwd = req.body.data.password;
    db.querySql("select name,password,identity,phone,address from users where name=? and password=?", [name, pwd], function (error, results) {
        console.log('error==>>', error)
        res.json({
            code: 200,
            data: results,
            token: jws.generate(name),
            message: '成功'
        })
    })
});
/* 用户增删改查end */

/* 文物增删改查begin */
//显示当前管理员管辖范围内所有文物
app.get('/relics', function (req, res, next) {
    let authority = req.query.authority;
    console.log("要查找的文物所属管理员是:", authority);
    db.querySql("select * from relics where relicAuthority=?", [authority], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
//删除文物
app.post('/relic/del', function (req, res, next) {
    let relicId = req.body.data.relicId
    let sql = `delete from relics where relicId=?`
    db.querySql(sql, [relicId], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
//编辑文物信息
app.post('/editRelic', function (req, res, next) {
    let relicId = req.body.data.relicId
    let relicName = req.body.data.relicName
    let relicType = req.body.data.relicType
    let relicIntro = req.body.data.relicIntro
    let relicImg = req.body.data.relicImg
    let relicAuthority = req.body.data.relicAuthority
    let sql = `UPDATE relics SET relicName=?,relicType=?,relicIntro=?,relicImg=?,relicAuthority=? where relicId=?`
    db.querySql(sql, [relicName, relicType, relicIntro, relicImg, relicAuthority, relicId], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    })
});
//添加当前管理下的文物
app.post('/addRelic', function (req, res, next) {
    let relicId = req.body.data.relicId
    let relicName = req.body.data.relicName
    let relicType = req.body.data.relicType
    let relicIntro = req.body.data.relicIntro
    let relicImg = req.body.data.relicImg
    let relicAuthority = req.body.data.relicAuthority
    console.log(relicId, relicName, relicType, relicIntro, relicImg, relicAuthority);
    let sql = `INSERT INTO relics ( relicId,relicName,relicType,relicIntro,relicImg,relicAuthority ) VALUES ( '${relicId}','${relicName}','${relicType}','${relicIntro}','${relicImg}','${relicAuthority}' )`
    db.querySql(sql, [], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
//二级管理员显示所有文物
app.get('/allRelics', function (req, res, next) {
    db.querySql("select * from relics", [], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
app.post('/fileUpload', (req, res) => {
    console.log("1111", req.files[0]);
    var fileUrl = __dirname + "/public/" + req.files[0].originalname; //文件名
    console.log("2222", fileUrl);
    fs.readFile(req.files[0].path, (err, response) => {
        fs.writeFile(fileUrl, response, (err => { //文件写入
            if (err) {
                console.log(err);
            } else {
                // 文件上传成功，respones给客户端
                res.json({
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                });
            }
        }))
    })
})


/* 文物增删改查end */

//存储感知层信息
app.post('/recordEnv', function (req, res, next) {
    console.log(req.body);
    const data = req.body.data;
    let time = data.time;
    delete data.time;
    let recordData = JSON.stringify(data);
    console.log('准备存入数据库的数据是', recordData);
    console.log('准备存入数据库的时间戳是', time);
    let sql = `INSERT INTO historydata ( recordtime,recorddata ) VALUES ('${time}','${recordData}' )`
    db.querySql(sql, [], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
// 查询历史环境数据
app.get('/getHistoryData', function (req, res, next) {
    db.querySql("select * from historydata", [], function (err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage })
        } else {
            res.json({ code: 200, data: results, message: 'success' })
        }
    });
});
// token检测拦截器
app.use(function (req, res, next) {
    console.log('token=', req.headers.token);
    if (req.url.startsWith('/login')) {
        next()
    } else {
        const token = req.headers.token || '';
        if (jws.verify(token)) {
            next()
        } else {
            res.json({
                code: 200,
                msg: '还未登录，请先登录'
            })
        }
    }
})

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
