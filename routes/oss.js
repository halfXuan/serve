var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path')
var fs = require('fs');
const { OSS_CONFIG } = require('./../config')
    // 初始化client
var co = require('co')
var OSS = require('ali-oss')
var client = new OSS({
    region: OSS_CONFIG.region,
    accessKeyId: OSS_CONFIG.accessKeyId,
    accessKeySecret: OSS_CONFIG.accessKeySecret
})

var ali_oss = {
        bucket: OSS_CONFIG.bucket,
        endPoint: OSS_CONFIG.endPoint,
    }
    // 微信小程序 图片上传
let upload = multer({
        storage: multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/uploads');
            },
            filename: function(req, file, cb) {
                var changedName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
                cb(null, changedName);
            }
        })
    })
    // 图片上传
router.post('/upload', upload.single('file'), function(req, res, next) {
    // 文件路径
    var filePath = './' + req.file.path;
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 构建图片名
    var fileName = Date.now() + lastName;
    // 图片重命名
    var key = fileName;
    // 阿里云 上传文件 
    co(function*() {
        client.useBucket(ali_oss.bucket);
        var result = yield client.put(key, filePath);
        var imageSrc = `http://${OSS_CONFIG.BucketName}/` + result.name;
        // 上传之后删除本地文件
        fs.unlinkSync(filePath);
        res.end(JSON.stringify({ code: 1, msg: '上传成功', path: imageSrc }));
    }).catch(function(err) {
        // 上传之后删除本地文件
        fs.unlinkSync(filePath);
        res.end(JSON.stringify({ code: 0, msg: '上传失败', error: JSON.stringify(err) }));
    });
})
module.exports = router;