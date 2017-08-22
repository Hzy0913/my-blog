var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var mime = require('mime');
var router = require('./server/router');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');
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
        //maxAge: 60 * 1000 *60*24*3  // 有效期，单位是毫秒, 这里设置的是15分钟
        maxAge: 10*60 * 1000  // 有效期，单位是毫秒, 这里设置的是2分钟
    }
}));

app.use(router)

// 后台管理页
app.get('/admin', function(req, res) {

    //本地测试注释掉这段代码，线上可以放开
    //var sess = req.session;
    //console.log(sess)
    //var loginUser = sess.loginUser;
    //var isLogined = !!loginUser;
    //
    //var publicuser = sess.public;
    //var ispublicLogined = !!publicuser;
    //
    //console.log(ispublicLogined)
    //console.log(isLogined)

    var isLogined=true;
    if(isLogined){
        console.log('已登录')
        res.sendFile(resolve('./' + 'admin.html'))
    }
    else if (ispublicLogined){
        console.log('已登录1')
        //res.sendFile(resolve('./' + 'public.html'), 'utf-8')
        res.redirect("/public")
        //res.sendFile(resolve('./' + 'public.html'))
        //res.end();
        //var html = fs.readFileSync(resolve('./' + 'public.html'), 'utf-8');
    }else {
        console.log('未登录')
        res.redirect("/login")

    }

});






// login
app.get('/login', function(req, res) {
    res.sendFile(resolve('./' + 'login.html'))
});



// my
app.get('/my', function(req, res) {
    //var html = fs.readFileSync(resolve('./' + 'my.html'), 'utf-8');
    res.sendFile(resolve('./' + 'my.html'))
});
// public
app.get('/public', function(req, res) {
    var sess = req.session;
    console.log(sess)
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;

    var publicuser = sess.public;
    var ispublicLogined = !!publicuser;

    console.log(ispublicLogined)
    console.log(isLogined)
    if (ispublicLogined){
        console.log('已登录pubilc1')
        res.sendFile(resolve('./' + 'public.html'))
        //res.redirect("/public")
        //res.end();
        //var html = fs.readFileSync(resolve('./' + 'public.html'), 'utf-8');
    }else {
        console.log('未登录')
        res.redirect("/login")
        //res.sendFile(resolve('./' + 'login.html'))
        //res.end();
        //var html = fs.readFileSync(resolve('./' + 'login.html'), 'utf-8');
    }
    //res.end();
    //res.sendFile(resolve('./' + 'public.html'), 'utf-8')
});


// 博客首页
app.get('*', function(req, res) {
    //var html = fs.readFileSync(resolve('./' + 'index.html'), 'utf-8');
    res.sendFile(resolve('./' + 'index.html'), 'utf-8')
    //res.send(html)
});

app.listen(process.env.PORT || 7000, function() {
    console.log("应用实例，本地访问地址为 localhost:7000")
});
