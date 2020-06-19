/*
 * @Author: 471826078@qq.com
 * @Date: 2020-06-01 09:34:24
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-01 16:20:23
 */
const express = require('express')
const router = express.Router()
const Comments = require('./../model/comment')
const Users = require('./../model/user')
const Articles = require('./../model/article')
const tokenConfig = require('./../utils/tokens')
    /**
     * @swagger
     * /addComment:
     *  post:
     *      tags: 
     *           - 评论
     *      summary:  增加评论
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
router.post('/addComment', (req, res, next) => {
        const token = req.headers['authorization']
        if (token) {
            const { exp, id } = tokenConfig.verifyToken(token)
            const dates = new Date()
            const nowDate = parseInt(dates.getTime() / 1000)
            if (exp > nowDate) {
                Users.findById({ _id: id }, (err, doc) => {
                    if (err) {
                        res.send({ isSuccess: false, message: '评论失败' });
                    } else {
                        const userInfo = doc[0];
                        const { articleId, recoveryId, content } = req.body
                        if (recoveryId) {
                            Users.findById({ _id: recoveryId }, (err, docRecover) => {
                                if (err) {
                                    res.send({ isSuccess: false, message: '评论失败' });
                                } else {
                                    const recoveryInfo = docRecover[0];
                                    const newComments = new Comments({
                                        articleId,
                                        userInfo,
                                        recoveryInfo,
                                        content,
                                        createDate: tokenConfig.getNowDateTimes()
                                    })
                                    newComments.save(err => {
                                        const datas = {}
                                        if (err) {
                                            datas = { isSuccess: false, message: '评论失败' }
                                        } else {
                                            datas = { isSuccess: true, message: '评论成功' }
                                            Articles.update({ _id: req.params.id }, { $inc: { count: 1 } }, { multi: false }, () => {})
                                        }
                                        res.send(datas);
                                    })
                                }
                            })
                        } else {
                            const newComments = new Comments({
                                articleId,
                                userInfo,
                                recoveryInfo,
                                content,
                                createDate: tokenConfig.getNowDateTimes()
                            })
                            newComments.save(err => {
                                const datas = {}
                                if (err) {
                                    datas = { isSuccess: false, message: '评论失败' }
                                } else {
                                    datas = { isSuccess: true, message: '评论成功' }
                                    Articles.update({ _id: req.params.id }, { $inc: { count: 1 } }, { multi: false }, () => {})
                                }
                                res.send(datas);
                            })
                        }

                    }

                })

            } else {
                return res.status(403).send('token失效');
            }
        } else {
            const { articleId, name, email, recoveryId, content } = req.body
            Users.find({ name, email }, (err, userDoc) => {
                if (err) {
                    res.send({ isSuccess: false, message: '评论失败' });
                } else {
                    if (userDoc.length > 0) {
                        res.send({ isSuccess: false, message: '当前用户已注册，请先登录' });
                    } else {
                        const newUser = new Users({
                            name,
                            email,
                            password,
                            createDate: new Date().getTime(),
                            phone: phone ? phone : '',
                            types: phone === '18727994495' ? 1 : 0
                        })
                        newUser.save(err, users => {
                            if (err) {
                                res.send({ isSuccess: false, message: '评论失败' });
                            } else {
                                const userInfo = users[0];
                                if (recoveryId) {
                                    Users.findById({ _id: recoveryId }, (err, docRecover) => {
                                        if (err) {
                                            res.send({ isSuccess: false, message: '评论失败' });
                                        } else {
                                            const recoveryInfo = docRecover[0];
                                            const newComments = new Comments({
                                                articleId,
                                                userInfo,
                                                recoveryInfo,
                                                content,
                                                createDate: tokenConfig.getNowDateTimes()
                                            })
                                            newComments.save(err => {
                                                const datas = {}
                                                if (err) {
                                                    datas = { isSuccess: false, message: '评论失败' }
                                                } else {
                                                    datas = { isSuccess: true, message: '评论成功' }
                                                    Articles.update({ _id: req.params.id }, { $inc: { count: 1 } }, { multi: false }, () => {})
                                                }
                                                res.send(datas);
                                            })
                                        }
                                    })
                                } else {
                                    const newComments = new Comments({
                                        articleId,
                                        userInfo,
                                        recoveryInfo,
                                        content,
                                        createDate: tokenConfig.getNowDateTimes()
                                    })
                                    newComments.save(err => {
                                        const datas = {}
                                        if (err) {
                                            datas = { isSuccess: false, message: '评论失败' }
                                        } else {
                                            datas = { isSuccess: true, message: '评论成功' }
                                            Articles.update({ _id: req.params.id }, { $inc: { count: 1 } }, { multi: false }, () => {})
                                        }
                                        res.send(datas);
                                    })
                                }
                            }
                        })
                    }
                }

            })
        }
    })
    /**
     * @swagger
     * /deleteCommemt:
     *  post:
     *      tags: 
     *           - 评论
     *      summary:  删除评论
     *      parameters:
     *        - name: id
     *          in: query
     *          required: true
     *          type: string
     *        - name: userId
     *          in: query
     *          required: true
     *          type: string
     * 
     */
router.post('/deleteCommemt', (req, res, next) => {
    const { id, userId } = req.body
    Comments.findOneAndRemove({ _id: id, 'userInfo._id': userId }, (err, doc) => {
        if (err) {
            res.send({ isSuccess: false, message: '删除失败' });
        } else {
            res.send({ isSuccess: true, message: '删除成功' });
        }
    })
})
router.get('/query', (req, res, next) => {
        Comments.find({}, (err, doc) => {
            if (err) {
                res.send({ isSuccess: false, message: '查询失败' });
            } else {
                res.send({ isSuccess: true, data: doc });
            }
        })
    })
    /**
     * @swagger
     * /queryByArticleId:
     *  get:
     *      tags: 
     *           - 评论
     *      summary:  查找文章对所有评论
     *      parameters:
     *        - name: articleId
     *          in: query
     *          required: true
     *          type: string
     * 
     */
router.get('/queryByArticleId', (req, res, next) => {
        const { articleId } = req.body
        Comments.find({ articleId }, (err, doc) => {
            if (err) {
                res.send({ isSuccess: false, message: '操作失败' });
            } else {
                res.send({ isSuccess: true, data: doc });
            }
        })
    })
    /**
     * @swagger
     * /queryAll:
     *  get:
     *      tags: 
     *           - 评论
     *      summary:  查找所有评论
     *      parameters:
     * 
     */
router.get('/queryAll', (req, res, next) => {
    Comments.find((err, doc) => {
        if (err) {
            res.send({ isSuccess: false, message: '操作失败' });
        } else {
            res.send({ isSuccess: true, data: doc });
        }
    })
})
module.exports = router