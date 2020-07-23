/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-28 09:43:52
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-07-20 09:48:29
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const friendSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    blogUrl: {
        type: String,
        required: true
    },
    blogImg: {
        type: String,
        required: true
    },
    sign: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Number,
        required: true,
        default: new Date().getTime() / 1000
    }
})

module.exports = mongoose.model('FriendLink', friendSchema)