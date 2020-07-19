/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-28 09:48:50
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-01 17:28:52
 */
const express = require('express')
const router = express.Router()
const Links = require('./../model/links')
    /**
     * @name: 新增和修改
     * @param {type} 
     * @Author: luoyong
     */

router.post('/add', (req, res, next) => {
        const { _id, name, url } = req.body
        if (_id) {
            Links.findByIdAndUpdate({ _id }, { name, url }, (err, doc) => {
                const datas = err ? { isSuccess: false, message: '修改失败' } : { isSuccess: true, message: '修改成功' }
                res.send(datas);
            })
        } else {
            const newLinks = new Links({
                name,
                url
            })
            Links.find({ name }, (err, doc) => {
                if (err) {
                    res.send({ isSuccess: false, message: '保存失败' })
                } else {
                    if (doc.length) {
                        res.send({ isSuccess: false, message: '当前链接已存在' })
                    } else {
                        newLinks.save((err) => {
                            const datas = err ? { isSuccess: false, message: '保存失败' } : { isSuccess: true, message: '保存成功' }
                            res.send(datas);
                        })
                    }
                }
            })

        }
    })
    /**
     * @name: 查询所有
     * @param {type} 
     * @Author: luoyong
     */
router.get('/query', (req, res, next) => {
        Links.find().exec((err, doc) => {
            const datas = err ? { isSuccess: false, message: '查询失败' } : { isSuccess: true, data: doc }
            res.send(datas);
        })
    })
    /**
     * @name: 删除
     * @param {string} _id 
     * @Author: luoyong
     */
router.post('/dele', (req, res, next) => {
    const { _id } = req.body
    if (_id) {
        Links.findByIdAndRemove({ _id }, (err) => {
            const datas = err ? { isSuccess: false, message: '删除失败' } : { isSuccess: true, message: '删除成功' }
            res.send(datas);
        })
    } else {
        res.send({ isSuccess: false, message: '_id必传' })
    }
})
module.exports = router