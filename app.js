var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mime = require('mime');
var router = require('./server/router');
var compression = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var app = express();

var resolve = file => path.resolve(__dirname, file);
app.use(compression());
//app.use(express.static('dist'));
app.use('/dist', express.static(resolve('./dist')));
//app.use(express.static(path.join(__dirname, 'dist')));
//app.use(express.static('/dist'));
//app.use('/articlesDetails', express.static('dist'));
//app.use('/articlesDetails/dist', express.static(resolve('./dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var identityKey = 'skey';

app.use(session({
    name: identityKey,
    secret: 'chyingp',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 2 * 1000  // 有效期，单位是毫秒, 这里设置的是15分钟
    }
}));

app.use(router)

// 后台管理页
app.get('/admin', function(req, res) {
    var sess = req.session;
    console.log(sess)
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    if (isLogined){
        console.log('已登录')
        var html = fs.readFileSync(resolve('./' + 'admin.html'), 'utf-8');
    }else{
        console.log('未登录')
        var html = fs.readFileSync(resolve('./' + 'login.html'), 'utf-8');
    }
	res.send(html)
});
// 公用登录
app.get('/public', function(req, res) {
    var sess = req.session;
    console.log(sess)
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    if (isLogined){
        console.log('已登录')
        var html = fs.readFileSync(resolve('./' + 'admin.html'), 'utf-8');
    }else{
        console.log('未登录')
        var html = fs.readFileSync(resolve('./' + 'public.html'), 'utf-8');
    }
    res.send(html)
});

// 博客首页
app.get('*', function(req, res) {
    var html = fs.readFileSync(resolve('./' + 'index.html'), 'utf-8');
    res.send(html)
});

app.listen(process.env.PORT || 7000, function() {
    console.log("应用实例，访问地址为 localhost:7000")
});
