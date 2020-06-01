/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-26 12:13:06
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-05-27 14:00:55
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

 router.post('/addArticle',(req,res,next)=>{
    
 })
 /**
  * @name: 查询文章
  * @param {type} 
  * @Author: 471826078@qq.com
  */
 router.post('/queryAll',(req,res,next)=>{
    Articles.find({},(err, docs)=>{
        if(err){
            res.send({ isSuccess: false, message: '删除失败' });
        }else {
            res.send({ isSuccess: true, data:docs });
        }
    })
})
 module.exports = router
