/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-28 09:43:52
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-05-28 09:48:29
 */ 
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const labelSchema = new Schema({
   name: {
       type:String,
       required: true
   },
   note:{
       type:String
   }
}) 

module.exports = mongoose.model('Label',labelSchema)