/*
 * @Author: 471826078@qq.com
 * @Date: 2020-06-18 09:58:44
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-18 10:34:07
 */

const adminPhone = '18727994495'
const jwtSecret = 'coderLuo-blog'
const noToken = [
    //用户
    '/api/users/register',
    '/api/users/adminLogin',
    '/api/users/login',
    '/api/users/query',
    //文章
    '/api/article/queryWeb',
    '/api/article/getPreAndNext',
    '/api/article/query',
    '/api/article/queryById',
    '/api/article/queryLike',
    //标签
    '/api/label/query',
    //链接
    '/api/links/query',
    //评论
    '/api/comment/query',
    '/api/comment/queryByArticleId',
    '/api/comment/queryAll'

]
module.exports = {
    adminPhone,
    jwtSecret,
    noToken
}