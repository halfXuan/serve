const express = require('express')
const router = express.Router()
const FriendsLink = require('./../model/friendLink')

router.post('/addFriend', (req, res, next) => {
    const { name, blogUrl, blogImg, sign } = req.body;
    FriendsLink.find({ blogUrl }, (err, doc) => {
        if (err) {
            res.send({ isSuccess: false, message: '友链申请失败' });
        } else {
            if (doc.length) {
                res.send({ isSuccess: false, message: '当前博客地址已存在' });
            } else {
                new FriendsLink({
                    name,
                    blogUrl,
                    blogImg,
                    sign
                }).save(err => {
                    const datas = err ? { isSuccess: false, message: '友链申请失败' } : { isSuccess: true, message: '友链申请成功' }
                    res.send(datas);
                })
            }
        }
    })
})

router.post('/deleteFriend', (req, res, next) => {
    const { _id } = req.body
    FriendsLink.findByIdAndRemove({ _id }, (err, doc) => {
        const datas = err ? { isSuccess: false, message: '友链删除失败' } : { isSuccess: true, message: '友链删除成功' }
        res.send(datas);
    })
})

router.post('/updateStatus', (req, res, next) => {
    const { _id, status } = req.body
    FriendsLink.findOneAndUpdate({ _id }, { status }, (err, doc) => {
        const datas = err ? { isSuccess: false, message: '友链更新失败' } : { isSuccess: true, message: '友链更新成功' }
        res.send(datas);
    })
})

router.get('/queryAll', (req, res, next) => {
    FriendsLink.find({}).exec((err, doc) => {
        const datas = err ? { isSuccess: false, message: '查询失败' } : { isSuccess: true, data: doc }
        res.send(datas);
    })
})

router.get('/queryForWeb', (req, res, next) => {
    FriendsLink.find({ status: 1 }).limit(20).exec((err, doc) => {
        const datas = err ? { isSuccess: false, message: '查询失败' } : { isSuccess: true, data: doc }
        res.send(datas);
    })
})

module.exports = router