/*
 * @Author: 471826078@qq.com
 * @Date: 2020-07-05 13:53:58
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-07-05 15:14:46
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const linksSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    createDate: {
        type: Number,
        required: true,
        default: new Date().getTime() / 1000
    }
})

module.exports = mongoose.model('Links', linksSchema)