var express = require('express');
var router = express.Router();
var users = require('./user').items;
var db = require('./db');
var app = express();
var findUser = function(name, password){
    return users.find(function(item){
        return item.name === name && item.password === password;
    });
};

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
    db.User.find({}, function(err, docs){
        if(err)return;
        var isExist = false;
        docs.forEach(function(item){
            console.log(item)
            if(item.UserName == req.body.UserName){
                isExist = true;
            }
        })
        console.log(isExist)
        if (isExist){
            res.json({error: true, msg: '用户已存在'})
        }else{
            console.log(req.body.UserName)
            new db.User({name:req.body.UserName}).save(function(error){
                if (error) {
                    res.send('保存失败');
                    return
                }
                console.log(db.User)
                res.send()
            })
        }
    })
})
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

module.exports = router