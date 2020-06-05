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
    var token = req.headers['authorization'];
    if (token) {
        const { exp } = tokenConfig.verifyToken(token)
        const dates = new Date()
        const noDate = parseInt(dates.getTime() / 1000);
        if (exp > noDate) {
            const { name, labels, isAuthor, isTop, isPublish, imgUrl, content, htmlContent } = req.body;
            if (!imgUrl) {
                res.send({ isSuccess: false, message: '请先上传封面图片' });
                return false
            }
            if (!content) {
                res.send({ isSuccess: false, message: '文章内容 不能为空' });
                return false
            }
            Articles.find({ name }, (err, doc) => {

            })
        } else {
            return res.status(403).send('token失效');
        }
    } else {
        return res.status(401).send('未登录');
    }

})
/**
 * @name: 查询文章
 * @param {type} 
 * @Author: 471826078@qq.com
 */
router.post('/queryAll', (req, res, next) => {
    Articles.find({}, (err, docs) => {
        if (err) {
            res.send({ isSuccess: false, message: '删除失败' });
        } else {
            res.send({ isSuccess: true, data: docs });
        }
    })
})
module.exports = router
