/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-21 09:48:04
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-05-27 17:39:22
 */
var express = require('express');
var router = express.Router();
const Users = require('./../model/user')
const tokenConfig = require('./../utils/tokens')
const { adminPhone } = require('./../config')
    /**
     * @name: 用户注册
     * @param {Object}  
     * @Author: 471826078@qq.com
     */
    /**
     * @swagger
     * /register:
     *  post:
     *      tags: 
     *           - 用户
     *      summary:  用户注册
     *      parameters:
     *        - name: name
     *          in: query
     *          required: true
     *          type: string
     *          description: 用户名称
     *        - name: phone
     *          in: query
     *          required: false
     *          type: string
     *          description: 手机号码
     *        - name: email
     *          in: query
     *          required: true
     *          type: string
     *          description: 用户邮箱
     *        - name: password
     *          in: query
     *          required: false
     *          type: string
     *          description: 用户密码
     *      response:
     *        200:
     *            description: 成功获取
     * 
     */
router.post('/register', function(req, res, next) {
    let message = ''
    console.log(req.body);

    const { name, phone, email, password } = req.body
    if (!name) {
        message = '用户名不能为空'
        res.send({ isSuccess: false, message });
        return false
    }
    if (!email) {
        message = '邮箱不能为空'
        res.send({ isSuccess: false, message });
        return false
    }


    Users.find({ name, email }, (err, doc) => {
        if (doc.length) {
            res.send({ isSuccess: false, message: '此用户已注册,请登录' });
        } else {
            const newUser = new Users({
                name,
                email,
                password,
                createDate: new Date().getTime(),
                phone: phone ? phone : '',
                types: phone == adminPhone ? 1 : 0
            })
            newUser.save(err => {
                const datas = err ? { isSuccess: false, message: '添加失败' } : { isSuccess: true, message: password ? '添加成功' : '添加成功,初始密码888888' }
                res.send(datas);
            })
        }
    })

});

/**
 * @name: 注销
 * @param {string}  id
 * @Author: 471826078@qq.com
 */
/**
 * @swagger
 * /cancelUser:
 *  post:
 *      tags: 
 *           - 用户
 *      summary:  用户注销
 *      parameters:
 *        - name: id
 *          in: query
 *          required: true
 *          type: string
 * 
 */
router.post('/cancelUser', (req, res, next) => {
        Users.findByIdAndUpdate({ _id: req.body.id }, { types: 2 }, (err, docs) => {
            if (err) {
                res.send({ isSuccess: false, message: '账户注销失败' });
            } else {
                res.send({ isSuccess: true, message: '账户注销成功' });
            }
        })
    })
    /**
     * @name: 管理员登录
     * @param {String} phone
     * @param {String} password 
     * @Author: 471826078@qq.com
     */
    /**
     * @swagger
     * /adminLogin:
     *  post:
     *      tags: 
     *           - 用户
     *      summary:  管理员登录
     *      parameters:
     *        - name: phone
     *          in: query
     *          required: true
     *          type: string
     *        - name: password
     *          in: query
     *          required: true
     *          type: string
     * 
     */
router.post('/adminLogin', (req, res, next) => {
        const { phone, password } = req.body
        Users.find({ phone }, (err, users) => {
            if (err) {
                res.send({ isSuccess: false, message: '登录失败' });
            } else {
                if (users.length == 0) {
                    res.send({ isSuccess: false, message: '该用户不存在' });
                } else if (users[0].password == password) {
                    if (users[0].types === 1) {
                        console.log(users[0]);

                        let token = tokenConfig.createToken(users[0]._id, 3600 * 24 * 3)
                        console.log(token);

                        users[0].token = token;
                        Users(users[0]).save(function(err) {
                            if (err) {
                                res.status(500).send()
                                return
                            }
                            res.send({ isSuccess: true, message: '登陆成功', 'token': token, 'user_name': req.body.phone }) //反给前台
                        })
                    } else {
                        res.send({ isSuccess: false, message: '账户类型错误' });
                    }

                } else if (users[0].password !== password) {
                    res.send({ isSuccess: false, message: '密码不正确，请重新输入' });
                }
            }
        })
    })
    /**
     * @name: 普通用户登录
     * @param {String} email
     * @param {String} password 
     * @Author: 471826078@qq.com
     */
    /**
     * @swagger
     * /login:
     *  post:
     *      tags: 
     *           - 用户
     *      summary:  普通用户登录
     *      parameters:
     *        - name: email
     *          in: query
     *          required: true
     *          type: string
     *        - name: password
     *          in: query
     *          required: true
     *          type: string
     * 
     */
router.post('/login', (req, res, next) => {
        const { email, password } = req.body
        Users.find({ email }, (err, users) => {
            if (err) {
                res.send({ isSuccess: false, message: '登录失败' });
            } else {
                if (users.length == 0) {
                    res.send({ isSuccess: false, message: '该用户不存在' });
                } else if (users[0].password == password) {
                    if (users[0].types === 0) {
                        let token = tokenConfig.createToken(users[0]._id, 3600 * 24 * 3)
                        users[0].token = token;
                        Users(users[0]).save(function(err) {
                            if (err) {
                                res.status(500).send()
                                return
                            }
                            res.send({ isSuccess: true, message: '登陆成功', 'token': token, 'user_name': req.body.email }) //反给前台
                        })
                    } else if (users[0].types === 1) {
                        if (users[0].phone === adminPhone) {
                            let token = tokenConfig.createToken(users[0]._id, 3600 * 24 * 3)
                            users[0].token = token;
                            Users(users[0]).save(function(err) {
                                if (err) {
                                    res.status(500).send()
                                    return
                                }
                                res.send({ isSuccess: true, message: '登陆成功', 'token': token, 'user_name': req.body.email }) //反给前台
                            })
                        } else {
                            res.send({ isSuccess: false, message: '用户类型错误' });
                        }

                    } else {
                        res.send({ isSuccess: false, message: '密码不正确，请重新输入' });
                    }
                } else if (users[0].password !== password) {
                    res.send({ isSuccess: false, message: '密码不正确，请重新输入' });
                }
            }
        })
    })
    /**
     * @swagger
     * /modifyPassword:
     *  post:
     *      tags: 
     *           - 用户
     *      summary:  修改密码
     *      parameters:
     *        - name: id
     *          in: query
     *          required: true
     *          type: string
     *        - name: newpassword
     *          in: query
     *          required: true
     *          type: string
     * 
     */
router.post('/modifyPassword', (req, res, next) => {
        Users.findByIdAndUpdate({ _id: req.body.id }, { password: req.body.newpassword, token: '' }, (err, docs) => {
            if (err) {
                res.send({ isSuccess: false, message: '账户注销失败' });
            } else {
                res.send({ isSuccess: true, message: '账户注销成功' });
            }
        })
    })
    /**
     * @name: 删除用户
     * @param {string} id 
     * @Author: 471826078@qq.com
     */
router.post('/deleteUser', (req, res, next) => {
    const { id } = req.body
    Users.findOneAndRemove({ _id: id }, (err, doc) => {
        if (err) {
            res.send({ isSuccess: false, message: '删除失败' });
        } else {
            res.send({ isSuccess: true, message: '删除成功' });
        }
    })
})
router.post('/query', (req, res, next) => {
    const { email } = req.body
    const whereStr = {};
    if (email) {
        whereStr.email = email
    }
    Users.find(whereStr, (err, doc) => {
        if (err) {
            res.send({ isSuccess: false, message: '查询失败' });
        } else {
            res.send({ isSuccess: true, data: doc });
        }
    })
})
module.exports = router;