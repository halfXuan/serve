/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-26 12:13:06
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-05 17:53:57
 */
const express = require('express')
const router = express.Router()
const Articles = require('./../model/article')
const tokenConfig = require('./../utils/tokens')

/**
 * @name: 写文章
 * @param {type} 
 * @Author: 471826078@qq.com
 */

router.post('/addArticle', (req, res, next) => {
        const { _id, name, labels, isAuthor, isTop, isPublish, imgUrl, content, htmlContent } = req.body;
        if (!imgUrl) {
            res.send({ isSuccess: false, message: '请先上传封面图片' });
            return false
        }
        if (!content) {
            res.send({ isSuccess: false, message: '文章内容 不能为空' });
            return false
        }
        if (_id) {
            Articles.findByIdAndUpdate({ _id }, { name, labels, isAuthor, isTop, isPublish, imgUrl, content, htmlContent }, (err) => {
                if (err) {
                    res.send({ isSuccess: false, message: '修改失败' });
                } else {
                    res.send({ isSuccess: true, message: '修改成功' });
                }
            })
        } else {
            Articles.find({ name }, (err, doc) => {
                if (err) {
                    res.send({ isSuccess: false, message: '保存失败' });
                } else {
                    if (doc.length > 0) {
                        res.send({ isSuccess: false, message: '请不要发布重名文章' });
                    } else {
                        const newArticle = new Articles({
                            name,
                            labels,
                            isAuthor,
                            isTop,
                            isPublish,
                            imgUrl,
                            content,
                            htmlContent,
                            createDate: parseInt(new Date() / 1000)
                        })
                        newArticle.save((err) => {
                            if (err) {
                                res.send({ isSuccess: false, message: '新增失败' });
                            } else {
                                res.send({ isSuccess: true, message: '新增成功' });
                            }
                        })
                    }
                }
            })
        }

    })
    /**
     * @name: 删除文章
     * @param {string} _id 文章id 
     * @Author: luoyong
     */
router.post('/deleteArticle', (req, res, next) => {
        const { _id } = req.body
        Articles.findOneAndRemove({ _id }, (err) => {
            if (err) {
                res.send({ isSuccess: false, message: '文章删除失败' });
            } else {
                res.send({ isSuccess: true, message: '文章删除成功' });
            }
        })
    })
    /**
     * @name: 更新文章
     * @param {string} _id 文章id 
     * @Author: luoyong
     */
router.post('/update', (req, res, next) => {
        const { _id, name, labels, isAuthor, isTop, isPublish, imgUrl, content, htmlContent } = req.body;
        let updateStr = {};
        if (name) { updateStr.name = name }
        if (labels.length) { updateStr.labels = labels }
        if (isAuthor) { updateStr.isAuthor = isAuthor }
        if (isTop) { updateStr.isTop = isTop }
        if (isPublish) { updateStr.isPublish = isPublish }
        if (imgUrl) { updateStr.imgUrl = imgUrl }
        if (content) { updateStr.content = content }
        if (htmlContent) { updateStr.htmlContent = htmlContent }
        Articles.findOneAndUpdate({ _id }, updateStr, (err) => {
            if (err) {
                res.send({ isSuccess: false, message: '文章修改失败' });
            } else {
                res.send({ isSuccess: true, message: '文章修改成功' });
            }
        })
    })
    /**
     * @name: 查询文章
     * @param {type} 
     * @Author: 471826078@qq.com
     */
router.post('/queryById', (req, res, next) => {
        const { _id } = req.body
        Articles.find({ _id }, (err, docs) => {
            if (err) {
                res.send({ isSuccess: false, message: '查询失败' });
            } else {
                res.send({ isSuccess: true, data: docs[0] });
            }
        })
    })
    /**
     * @name: 分页查询
     * @param {number} pageSize 每页条数
     * @param {number} pageNo 当前页数  
     * @Author: 471826078@qq.com
     */
router.post('/query', (req, res, next) => {
        const { pageSize, pageNo } = req.body
        let size = pageSize || 10
        let num = pageNo || 0
        Articles.find({}, (err, doc) => {
            if (err) {
                res.send({ isSuccess: false, message: '查询失败' });
            } else {
                const total = doc.length
                Articles.find().sort({ _id: -1 }).skip(num * size).limit(size).exec((errs, docs) => {
                    if (err) {
                        res.send({ isSuccess: false, message: '查询失败' });
                    } else {
                        res.send({ isSuccess: false, data: docs, total });
                    }
                })
            }
        })

    })
    /**
     * @name: 文章的模糊查询
     * @param {string} str 文章标题
     * @Author: 471826078@qq.com
     */
router.post('/queryLike', (req, res, next) => {
    const { str } = req.body
    var qs = new RegExp(str);
    Articles.find({ name: qs }, (err, docs) => {
        if (err) {
            res.send({ isSuccess: false, message: '查询失败' });
        } else {
            res.send({ isSuccess: true, data: _id ? docs[0] : docs });
        }
    })
})
module.exports = router