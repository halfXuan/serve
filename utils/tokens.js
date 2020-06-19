/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-25 14:43:51
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-01 13:56:44
 */
var jwt = require('jsonwebtoken')
const { jwtSecret } = require('./../config')
const secret = jwtSecret
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
const verToken = function(token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token.split(' ')[1], signkey);
        resolve(info);
    })
}
const getNowDateTimes = () => {
    const nowDate = new Date();
    return parseInt(nowDate.getTime() / 1000)
}
module.exports = {
    createToken,
    verifyToken,
    verToken,
    getNowDateTimes
}