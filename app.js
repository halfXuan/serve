/*
 * @Author: 471826078@qq.com
 * @Date: 2020-05-21 09:48:04
 * @LastEditors: 471826078@qq.com
 * @LastEditTime: 2020-05-29 10:17:03
 */ 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose')

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
mongoose.connect('mongodb://localhost:27017/blogluo')

mongoose.connection.on( 'connected', () => {
	console.log('数据库连接成功！');
});
 
mongoose.connection.on( 'error', () => {
	console.log('数据库连接失败！');
}); 
 
mongoose.connection.on( 'disconnected', () => {
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
  },apis: [path.join(__dirname,'/routes/*.js')]
}
var swaggerSpec = swaggerDoc(options);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))


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
