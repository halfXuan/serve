/*
 * @Author: 471826078@qq.com
 * @Date: 2020-06-01 09:33:48
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-01 09:33:58
 */ 
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 如果用户已登录，传入userId;
// 没有登录传入用户邮箱和昵称注册用户
const commentSchema = new Schema({
    articleId: {
        type: String,
        required: true
    },
    userId: {
        type: String
    },
    userInfo: {
        type: Object,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    recoveryId: {
        String
    },
    recoveryInfo: {
        type: Object
    },
    content:{
        type: String,
        required: true
    },
    createDate:{
        type: String
    },
    likes:{
        type: Number,
        default:0
    }
})

module.exports = mongoose.model('Comment',commentSchema)