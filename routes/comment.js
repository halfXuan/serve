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

router.post('/addComment', (req, res, next) => {
    const token = req.headers['authorization']
    const dates = new Date()
    const nowDate = parseInt(dates.getTime())
    if (token) {
        const { exp, id } = tokenConfig.verifyToken(token)
        Users.findById({ _id: id }, (err, doc) => {
            if (err) {
                res.send({ isSuccess: false, message: '评论失败' });
            } else {
                const userInfo = doc;
                userInfo.password = '';
                userInfo.token = ''
                const { articleId, recoveryId, content, netAddress } = req.body
                    //如果是回复别人
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
                                netAddress,
                                createDate: nowDate
                            })
                            newComments.save(err => {
                                let datas = {}
                                if (err) {
                                    datas = { isSuccess: false, message: '评论失败' }
                                } else {
                                    datas = { isSuccess: true, message: '评论成功' }
                                    Articles.update({ _id: req.params.id }, { $inc: { commentCount: 1 } }, { multi: false }, () => {})
                                }
                                res.send(datas);
                            })
                        }
                    })
                } else {
                    //直接评论    
                    const newComments = new Comments({
                        articleId,
                        userInfo,
                        recoveryInfo: {},
                        content,
                        netAddress,
                        createDate: nowDate
                    })
                    newComments.save(err => {
                        let datas = {}
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
        //没有登录
        const { articleId, name, email, recoveryId, content, netAddress, password } = req.body
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
                        phone: '',
                        types: 0
                    })
                    newUser.save((err, users) => {
                        if (err) {
                            res.send({ isSuccess: false, message: '评论失败' });
                        } else {
                            const userInfo = users;
                            console.log(users);

                            userInfo.password = '';
                            userInfo.token = ''
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
                                            netAddress,
                                            createDate: nowDate
                                        })
                                        newComments.save(err => {
                                            let datas = {}
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
                                    recoveryInfo: {},
                                    content,
                                    netAddress,
                                    createDate: nowDate
                                })
                                newComments.save(err => {
                                    let datas = {}
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

router.get('/queryByArticleId', (req, res, next) => {
    console.log(req);

    const { articleId } = req.query
    Comments.find({ articleId }, (err, doc) => {
        if (err) {
            res.send({ isSuccess: false, message: '操作失败' });
        } else {
            res.send({ isSuccess: true, data: doc });
        }
    })
})

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