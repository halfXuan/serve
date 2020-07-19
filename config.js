/*
 * @Author: 471826078@qq.com
 * @Date: 2020-06-18 09:58:44
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-18 10:34:07
 */

const adminPhone = '18727994495'
const jwtSecret = 'coderLuo-blog'
const OSS_CONFIG = {
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4G36Cd9KuFm435cCasNr',
    accessKeySecret: '7iN0KoVgqCV0Bi3qPMtllqwlLmznoH',
    bucket: 'qingqianblog',
    endPoint: 'oss-cn-beijing.aliyuncs.com',
    BucketName: 'qingqianblog.oss-cn-beijing.aliyuncs.com',
}
const noToken = [
    //oss上传文件
    '/oss/uoload',
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
    '/api/commens/addComment',
    '/api/commens/query',
    '/api/commens/queryByArticleId',
    '/api/commens/queryAll'

]
module.exports = {
    adminPhone,
    jwtSecret,
    noToken,
    OSS_CONFIG
}