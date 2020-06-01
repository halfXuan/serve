/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-25 14:43:51
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-05-27 15:39:56
 */
var jwt = require('jsonwebtoken')
const secret = 'coderLuo-blog'
const createToken = (_id, expires, strTimes) => {
    const token = jwt.sign({ _id }, secret, {
        expiresIn: expires + ' ' + strTimes
    })
    return token
}

const verifyToken = (_token)=>{
    let verify = jwt.verify(_token, secret, (error, decoded)=>{
        if (error){
            return 'Token Invalid'
        }
        return decoded
    })
    return verify
}
module.exports = {
    createToken, verifyToken
}