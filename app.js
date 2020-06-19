/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-21 09:48:04
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-06-08 18:30:44
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const { verToken } = require('./utils/tokens')
const { jwtSecret, noToken } = require('./config')

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
mongoose.connect('mongodb://localhost:27017/blogluo')

mongoose.connection.on('connected', () => {
    console.log('数据库连接成功！');
});

mongoose.connection.on('error', () => {
    console.log('数据库连接失败！');
});

mongoose.connection.on('disconnected', () => {
    console.log('数据库连接断开！');
})
var options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'myBlog',
            version: '1.0.0',
            description: `author：471826078@qq.com,
                    name: 个人博客接口文档              
      `
        }
    },
    apis: [path.join(__dirname, '/routes/*.js')]
}
var swaggerSpec = swaggerDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
    //暴漏静态资源文件 暴漏之后我们可以通过域名访问该文件下的资源
    //  app.use(express.static('uploads'))

//token校验中间件
app.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (token == undefined) {
            return next()
        } else {
            verToken(token).then((data) => {
                req.data = data
                return next()
            }).catch((error) => {
                return next()
            })
        }
    })
    //验证token是否过期并规定哪些路由不用验证
console.log(jwtSecret);

app.use(expressJwt({
    secret: jwtSecret // 密匙
}).unless({
    path: noToken //除了这个地址，其他的URL都需要验证
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 导入路由文件
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var labelsRouter = require('./routes/label');

app.use('/api/index', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/labels', labelsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
//当token失效返回提示信息
app.use(function(err, req, res, next) {
    if (err.status == 401) {
        return res.status(401).send('token失效');
    }
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;