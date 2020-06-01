/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-25 13:53:58
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-05-25 15:14:46
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    types: {
        type: Number,
        default: 0, // 0普通会员，1管理员， 2注销
    },
    phone: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type:String,
        default: '888888'
    },
    token: {
        type: String
    },
    createDate: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)