const express = require('express')
const router = express.Router()
const Times = require('./../model/time')
    /**
     * @name: 新增和修改
     * @param {string} _id 
     * @Author: luoyong
     */
router.post('/add', (req, res, next) => {
        const { _id, description, name } = req.body;
        if (_id) {
            Times.findByIdAndUpdate({ _id }, { description, name }, (err) => {
                const datas = err ? { isSuccess: false, message: '修改失败' } : { isSuccess: true, message: '修改成功' }
                res.send(datas);
            })
        } else {
            const newTimes = new Times({
                name,
                description
            })
            Times.find({ name }, (err, doc) => {
                if (err) {
                    res.send({ isSuccess: false, message: '保存失败' })
                } else {
                    if (doc.length) {
                        res.send({ isSuccess: false, message: '当前时间轴已存在' })
                    } else {
                        newTimes.save((err) => {
                            const datas = err ? { isSuccess: false, message: '保存失败' } : { isSuccess: true, message: '保存成功' }
                            res.send(datas);
                        })
                    }
                }
            })
        }
    })
    /**
     * @name: 删除
     * @param {string} _id 
     * @Author: luoyong
     */
router.post('/deleteTime', (req, res, next) => {
        const { _id } = req.body
        if (_id) {
            Times.findByIdAndRemove({ _id }, (err) => {
                const datas = err ? { isSuccess: false, message: '删除失败' } : { isSuccess: true, message: '删除成功' }
                res.send(datas);
            })
        }
    })
    /**
     * @name: 查询
     * @Author: luoyong
     */
router.get('/queryTime', (req, res, next) => {
    Times.find().exec((err, doc) => {
        const datas = err ? { isSuccess: false, message: '查询失败' } : { isSuccess: true, data: doc }
        res.send(datas);
    })
})

module.exports = router