/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-25 14:43:51
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-01 13:56:44
 */
var jwt = require('jsonwebtoken')
const secret = 'coderLuo-blog'
const createToken = (_id, expires, strTimes) => {
    const token = jwt.sign({ _id }, secret, {
        expiresIn: expires + ' ' + strTimes
    })
    return token
}

const verifyToken = (_token) => {
    let verify = jwt.verify(_token, secret, (error, decoded) => {
        if (error) {
            return 'Token Invalid'
        }
        return decoded
    })
    return verify
}

const getNowDateTimes = () => {
    const nowDate = new Date();
    return parseInt(nowDate.getTime()/1000) 
}
module.exports = {
    createToken, verifyToken, getNowDateTimes
}