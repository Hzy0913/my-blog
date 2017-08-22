var express = require('express');
var qn = require("qn");
var bytes = require('bytes');
var multer = require('multer');
var url = require("url");
var crypto = require("crypto");
var router = express.Router();
var users = require('./user').items;
var db = require('./db');
var app = express();
var findUser = function(name, password){
    return users.find(function(item){
        return item.name === name && item.password === password;
    });
};





function sha1(str){
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}

function validateToken(req,res){
    var query = url.parse(req.url,true).query;
    //console.log("*** URL:" + req.url);
    //console.log(query);
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = "*********";//这里是你在微信开发者中心页面里填的token，而不是****
    oriArray.sort();
    var original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature );
    var scyptoString = sha1(original);
    if(signature == scyptoString){
        res.end(echostr);
        console.log("Confirm and send echo back");
    }else {
        res.end("false");
        console.log("Failed!");
    }
}




//app.use(cookieParser('sessiontest'));
//app.use(session({
//    secret: '12345',
//     name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
//    cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
//    resave: false,
//    saveUninitialized: true,
//}));
//
//
//
//app.get('/awesome', function(req, res){
//
//        if(req.session.lastPage) {
//                 console.log('Last page was: ' + req.session.lastPage + ".");
//        }
//        req.session.lastPage = '/awesome'; //每一次访问时，session对象的lastPage会自动的保存或更新内存中的session中去。
//         res.send("You're Awesome. And the session expired time is: " + req.session.cookie.maxAge);
//     });
//
// app.get('/radical', function(req, res){
//         if (req.session.lastPage) {
//                 console.log('Last page was: ' + req.session.lastPage + ".");
//            }
//        req.session.lastPage = '/radical';
//         res.send('What a radical visit! And the session expired time is: ' + req.session.cookie.maxAge);
// });
//
//app.get('/tubular', function(req, res){
//        if (req.session.lastPage){
//                 console.log("Last page was: " + req.session.lastPage + ".");
//             }
//
//        req.session.lastPage = '/tubular';
//         res.send('Are you a suffer? And the session expired time is: ' + req.session.cookie.maxAge);
//     });
//
//app.listen(5000);


//router.get('/admin', function(req, res, next) {
//    var user={
//        name:"Chen-xy",
//        age:"22",
//        address:"bj"
//    }
//    req.session.user=user;
//    res.render('index', {
//        title: 'the test for nodejs session' ,
//        name:'sessiontest'
//    });
//});
//
////修改router/users.js，判断用户是否登陆。
//router.get('/admin', function(req, res, next) {
//    if(req.session.user){
//        var user=req.session.user;
//        var name=user.name;
//        res.send('你好'+name+'，欢迎来到我的家园。');
//        console.log(name)
//    }else{
//        res.send('你还没有登录，先登录下再试试！');
//    }
//});

// 登录接口
router.post('/api/login', function(req, res){
    var sess = req.session;
    var user = findUser(req.body.name, req.body.pwd);
    if(user){
        req.session.regenerate(function(err) {
            if(err){
                return res.json({code: 2, msg: '登录失败'});
            }
            console.log(user)
            req.session.loginUser = user.name;
            res.json({code: 0, msg: '登录成功'});
        });
    }else{


        res.json({code: 1, msg: '账号或密码错误'});
    }
})
// 公用登录接口
router.post('/api/public', function(req, res){
    var sess = req.session;
    if(true){
        req.session.regenerate(function(err) {
            if(err){
                return res.json({code: 2, msg: '失败'});
            }
            req.session.public = req.body.UserName;
            console.log(req.session)
            res.json({code: 0, msg: '登录成功'});
        });
    }else{
        res.json({code: 1, msg: '失败'});
    }
})
//获取验证码 Verification
var txtArr=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9']
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
router.post('/api/getVerif', function(req, res){
    var Verification=[];
    var Verificationstr='';
    for(var i = 1; i <= 4; i++) {
        var txt = txtArr[randomNum(0, txtArr.length)];
        Verificationstr+=txt
        Verification.push(txt) ;
    }

    var Verificationstrlow=Verificationstr.toLowerCase();
    var sess = req.session;

    if(true){
        req.session.regenerate(function(err) {
            if(err){
                return res.json({code: 2, msg: '失败'});
            }
            req.session.Verifcode = Verificationstrlow;
            res.json({code: 0, msg:Verification});
        });
    }else{
        res.json({code: 1, msg: '失败'});
    }
})


router.post('/list/getVerif', function(req, res){
    var Verification=[];
    var Verificationstr='';
    for(var i = 1; i <= 4; i++) {
        var txt = txtArr[randomNum(0, txtArr.length)];
        Verificationstr+=txt
        Verification.push(txt) ;
    }

    var Verificationstrlow=Verificationstr.toLowerCase();
    var sess = req.session;

    if(true){
        req.session.regenerate(function(err) {
            if(err){
                return res.json({code: 2, msg: '失败'});
            }
            req.session.Verifcode = Verificationstrlow;
            res.json({code: 0, msg:Verification});
        });
    }else{
        res.json({code: 1, msg: '失败'});
    }
})


router.post('/api/checkcode', function(req, res){
    var usercodeorg=req.body.usercode;
    var usercodelow=usercodeorg.toLowerCase();
    var Verif=req.session.Verifcode


    //
    //
    ////var Verificationstrsess = req.session.Verifcode;
    //console.log("zheli")
    //console.log(req.session.Verifcode)
    //console.log(usercodelow)
    if(usercodelow==req.session.Verifcode){
        res.json({code: 0, msg: '验证成功'});
    }else {
        res.json({code: 1, msg: '验证失败'});
    }
});






// 查询文章列表路由 用于博客前端展示数据不包含草稿内容
var pagenum=10;
router.get('/api/articleList', function(req, res){
    db.Article.find({state: "publish"}, function(err, docs){
        if (err) {
            console.log('出错'+ err);
            return
        }
        res.json(docs)
    }).sort({date:-1}).skip(0*pagenum).limit(pagenum)
});
//查询文章列表分页路由
router.get('/api/articleList/:page', function(req, res){
    let page=req.params.page
    console.log(page)
    db.Article.find({state: "publish"}, function(err, docs){
        if (err) {
            console.log('出错'+ err);
            return
        }
        res.json(docs)
    }).sort({date:-1}).skip(page*pagenum).limit(pagenum)
});
// 按标签ID查询文章列表路由 用于博客前端展示数据不包含草稿内容
router.post('/api/articleList', function(req, res){
    db.TagList.find({_id: req.body.tagId}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        db.Article.find({label: docs[0].tagName[0],state: "publish"}, function(err, docs){
            if (err) {
                res.status(500).send();
                return
            }
            res.json(docs)
        })
    })
});
// 查询文章列表路由 用于博客后端管理系统包含草稿和已发布文章数据
router.get('/api/admin/articleList', function(req, res){
    db.Article.find({}, function(err, docs){
        if (err) {
            console.log('出错'+ err);
            return
        }
        res.json(docs)
        //console.log(docs)
    })
});
// 查询文章列表路由 用于博客后端管理系统包含草稿和已发布文章数据
router.get('/api/admin/examineList', function(req, res){
    db.Article.find({state: "draft"}, function(err, docs){
        if (err) {
            console.log('出错'+ err);
            return
        }
        res.json(docs)
        //console.log(docs)
    })
});

// 查询文章列表路由(根据标签返回对应的文章列表) 用于博客后端管理系统包含草稿和已发布文章数据
router.post('/api/admin/articleList', function(req, res){
    db.Article.find({label: req.body.label}, function(err, docs){
        if (err) {
            console.log('出错'+ err);
            return
        }
        res.json(docs)
    })
});
// 查询文章详情路由
router.get('/api/articleDetails/:id', function(req, res){
    db.Article.findOne({_id: req.params.id}, function(err, docs){
        if (err) {
            return
        }
        res.send(docs)
    })
});
router.post('/api/articleDetails', function(req, res){
    db.Article.findOne({_id: req.body.id}, function(err, docs){
        if (err) {
            return
        }
        res.send(docs)
    })
});
// 文章保存路由
router.post('/api/saveArticle', function(req, res){
    new db.Article(req.body.articleInformation).save(function(error){
        if (error) {
            res.status(500).send()
            return
        }
        if (req.body.articleInformation.state != 'draft') {
            db.Article.find({label:req.body.articleInformation.label[0]},function(err, ArticleList){
                if (err) {
                    return
                }
                console.log(req.body.articleInformation.label)
                console.log(req.body.articleInformation.label[0])

                db.TagList.find({tagName:req.body.articleInformation.label[0]}, function(err, docs){
                    if(docs.length>0){
                        docs[0].tagNumber = ArticleList.length
                        db.TagList(docs[0]).save(function(error){})
                    }
                })
            })
        }
        res.send()
    })
});

// 文章更新路由
router.post('/api/updateArticle', function(req, res){
    db.Article.find({_id: req.body.obj._id}, function(err, docs){
        if(err){
            return
        }
        //console.log(docs)
        docs[0].title = req.body.obj.title
        docs[0].articleContent = req.body.obj.articleContent
        // 不更新文章更改时间
        docs[0].date = docs[0].date
        docs[0].state = req.body.obj.state
        docs[0].label = req.body.obj.label[0]
        docs[0].tag = req.body.obj.label[0]
        db.Article(docs[0]).save(function(err){
            if (err){
                res.status(500).send();
                return
            }
            //console.log(req.body.obj.label)
            res.send()
        })
    })
});

// 删除文章
router.post('/api/delect/article', function(req, res){
    db.Article.remove({_id: req.body._id}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        res.send()
    })
})
// 删除标签
router.post('/api/delect/tag', function(req, res){
    db.TagList.remove({tagName: req.body.tagName}, function(err, docs){
        //console.log(req.body.tagName)
        if (err) {
            res.status(500).send();
            return
        }

        console.log('remove success');



        res.send()
    })
})
// 文章标签查询路由
var pagelabenum=10;
router.get('/api/getArticleLabel/:labe', function(req, res){
    db.Article.find({tag:req.params.labe}, function(err, docs){
        if (err)return;
        //console.log(docs)
        res.json(docs)
    }).sort({date:-1}).skip(0*pagenum).limit(pagenum)
});
// 文章标签查询分页路由
router.get('/api/getArticleLabel/:labe/:page', function(req, res){
    let page=req.params.page
    console.log(page)
    console.log(req.params.labe)
    db.Article.find({tag:req.params.labe}, function(err, docs){
        if (err)return;
        //console.log(docs)
        res.json(docs)
    }).sort({date:-1}).skip(page*pagenum).limit(pagenum)
});
// 文章模糊查询路由
router.get('/api/getArticleList/:search', function(req, res){
    console.log(req.params.search)
    var searchval=req.params.search
    console.log(searchval)
    db.Article.find({title:{$regex: searchval, $options:'i'}}, function(err, docs){
        if (err)return;
        console.log(docs)
        res.json(docs)
    })
});
//后台标签
router.get('/api/getArticleLabel', function(req, res){
    db.TagList.find({}, function(err, docs){
        if (err)return;
        console.log(docs)
        res.json(docs)
    })
});
// 文章标签保存路由
router.post('/api/saveArticleLabel', function(req, res){
    db.TagList.find({}, function(err, docs){
        if(err)return;
        var isExist = false;
        docs.forEach(function(item){
            if(item.tagName == req.body.tagList.tagName){
                isExist = true;
            }
        })
        if (isExist){
            res.json({error: true, msg: '标签已存在'})
        }else{
            new db.TagList(req.body.tagList).save(function(error){
                if (error) {
                    res.send('保存失败');
                    return
                }
                res.send()
            })
        }
    })
});
// 博客信息路由
router.post('/api/save/personalInformation', function(req, res){
    db.PersonalInformation.find({}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        if(docs.length>0){
            docs[0].name = req.body.form.name
            docs[0].individualitySignature = req.body.form.individualitySignature
            docs[0].introduce = req.body.form.introduce
            db.PersonalInformation(docs[0]).save(function(err){
                if (err) {
                    res.status(500).send();
                    return
                }
                res.send();
            })
        } else {
            new db.PersonalInformation(req.body.from).save(function(err){
                if (err){
                    res.status(500).send();
                    return
                }
                res.send();
            })
        }
    })
})

router.get('/api/personalInformation', function(req, res){
    db.PersonalInformation.find({}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        res.json(docs)
    })
})
// 微信token
router.get('/api/token', function (req, res){
    var query = url.parse(req.url,true).query;
    //console.log("*** URL:" + req.url);
    //console.log(query);
    function sha1(str){
        var md5sum = crypto.createHash("sha1");
        md5sum.update(str);
        str = md5sum.digest("hex");
        return str;
    }
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = "hzy913";//这里是你在微信开发者中心页面里填的token，而不是****
    oriArray.sort();
    var original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature );
    var scyptoString = sha1(original);
    if(signature == scyptoString){
        res.end(echostr);
        console.log("Confirm and send echo back");
    }else {
        res.end("false");
        console.log("Failed!");
    }
});

// img上传



const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: bytes('5MB') // 限制文件在2MB以内
    },
    fileFilter: function(req, files, callback) {
        // 只允许上传jpg|png|jpeg|gif格式的文件
        var type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|';
        var fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
        callback(null, !!fileTypeValid);
    }
});
router.post('/profile', function(req, res, next) {

    var client = qn.create({
        accessKey: 'W7xA97i9slgg5ZpBBP8gXTL4R1tqNUzWdBT15imw',
        secretKey: '1Z0_UAf9wvn1yBZmZgLsv-OXD4cNfzn07T8CLJRC',
        bucket: 'binliveimg',
        origin: 'http://img.binlive.cn/',
        // timeout: 3600000, // default rpc timeout: one hour, optional
        // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
         uploadURL: 'http://up-z1.qiniu.com',
    });


    upload.single('image')(req, res, function(err) {
        console.log(req.file)
        if (err) {
            return console.error(err);
        }
        if (req.file && req.file.buffer) {
            console.log('zhe')
            // 上传到七牛
            client.upload(req.file.buffer, {
                key: '/upload/' + new Date().getTime()
            }, function(err, result) {
                console.log(result.url)
                if (err) {
                    console.log(err)
                    return res.json({
                        code: 1,
                        msg: '上传失败！',
                        data: {
                            src: ''
                        }
                    });
                }
                res.json({
                    code: 0,
                    data: {
                        src: result.url
                    }
                });
            });
        }
    });




});










module.exports = router