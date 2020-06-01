/*
 * @Author: 471826078@qq.com
 * @Date: 2020-06-01 09:34:24
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-01 09:34:57
 */ 
const express = require('express')
const router = express.Router()
const Comments = require('./../model/comment')
const Users = require('./../model/user')
const tokenConfig = require('./../utils/tokens')

router.post('/addComment', (req, res, next) => {
    const token = req.headers['authorization']
    if (token) {
        const { exp, id } = tokenConfig.verifyToken(token)
        const dates = new Date()
        const nowDate = parseInt(dates.getTime() / 1000)
        if (exp > nowDate) {
            Users.findById({ _id: id }, (err, doc) => {
                if (err) {

                } else {
                    const userInfo = doc[0];
                    const { articleId, recoveryId, content } = req.body
                    if(recoveryId){
                        Users.findById({_id: recoveryId},(err,docRecover)=>{
                            if (err) {

                            } else {
                                const recoveryInfo = docRecover[0];

                            }
                        })
                    }
                    const newComments = new Comments({

                    })
                }

            })

        }
    }
})

module.exports = router