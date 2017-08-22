<template>
	<div class="articel-edit-wrap">
        <div class="article-title">
            <input type="text" v-model="articleTitle" placeholder="请输入文章标题">
        </div>
        <div class="article-toolbar">
            <div class="label">
                <el-popover ref="tag" placement="top-start" width="150" trigger="click">
                    <ul class="tag-list-wrap">
                        <li v-for="item in tags" @click="selectTag(item)">{{item.tagName}}</li>
                    </ul>
                </el-popover>
                <img src="../assets/tag.png" class="addtag" height="30" width="30" v-popover:tag>
                <el-tag v-for="(item,index) in list" :closable="true" type="success" :key="index" :close-transition="false" @close="handleClose(index)">
                    {{item.tagName}}
                </el-tag>
            </div>
            <div class="action-button">
                <el-button v-if="this.$route.query.id" type="danger" size="small" @click="delectArticles">删除</el-button>
                <el-button size="small" @click="saveDraft" :loading="loading">保存草稿</el-button>
                <el-button type="primary" size="small" @click="publishedArticles" :loading="loading1">发布文章</el-button>
            </div>
        </div>
        <textarea id="editor"></textarea>
        <transition name="el-zoom-in-center">
            <div id="uploadbox" :class="{'upload':upload}" v-show="show">
                <div class="imgurl">
                    <li v-for="(item,key) in imgurl">
                        <input  :id=key :value=item style="opacity:0">
                        <el-button @click="copy(key)">点击复制图片链接</el-button>
                    </li>
                </div>
                <i class="el-icon-circle-cross" id="closeupload" @click="closeupload"></i>
                <el-upload
                        action="http://www.binlive.cn/profile"
                        name="image"
                        list-type="picture-card"
                        :on-success="handleSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                    <p></p>
                </el-dialog>
            </div>
        </transition>
    </div>
</template>
<script>
import SimpleMDE from 'simplemde'
import '../assets/simplemde.css'
import marked from 'marked';
import highlight from 'highlight.js'
import '../assets/hybrid.css'


import { Message } from 'element-ui';
export default {
	data () {
        return {
            articleTitle: '',
            content: '',
            tags: [],
            tag:'',
            list: [],
            imgurl:[],
            dialogImageUrl: '',
            dialogVisible: false,
            upload: false,
            show: false,
            loading: false,
            loading1: false,
            user:{
                "avatar_url": "https://avatars5.githubusercontent.com/u/22450881?v=4",
                "html_url": "https://github.com/Hzy0913",
                "name": "韩兆赟"
                }
        }
    },
    mounted: function(){
        this.content="";
    	Date.prototype.format = function(format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o){
                if (new RegExp("(" + k + ")").test(format)){
                    format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
        var self = this
        var smde = new SimpleMDE({
            element: document.getElementById('editor'),
            autofocus: false,
            autosave: {
                enabled: true,
                uniqueId: 'MyUniqueID',
                delay: 30000
            },
            blockStyles: {
                bold: '__',
                italic: '_'
            },
            placeholder:"输入文章内容...",
            promptURLs:true,
            spellChecker:true,
            toolbar:[
                {name:'bold',title: '加粗',className: 'fa fa-bold',action:SimpleMDE.toggleBold},
                {name:'italic',title: '斜体',className: 'fa fa-italic',action:SimpleMDE.toggleItalic},
                {name:'heading',title: '标题',className: 'fa fa-header',action:SimpleMDE.toggleHeadingSmaller},
                {name:'heading-smaller',title: '副标题',className: 'fa fa-header fa-header-x fa-header-smaller',action:SimpleMDE.toggleHeading2}, '|',
                {name:'code',title: '代码格式',className: 'fa fa-code',action:SimpleMDE.toggleCodeBlock},
                {name:'quote',title: '引用',className: 'fa fa-quote-left',action:SimpleMDE.toggleBlockquote},
                {name:'ordered-list',title: '有序列表',className: 'fa fa-list-ol',action:SimpleMDE.toggleOrderedList},
                {name:'clean-block',title: '清除格式',className: 'fa fa-eraser fa-clean-block',action:SimpleMDE.cleanBlock},
                {name:'link',title: '插入链接',className: 'fa fa-link',action:SimpleMDE.drawLink}, '|',
                {name:'horizontal-rule',title: '插入水平线',className: 'fa fa-minus',action:SimpleMDE.drawHorizontalRule},
                {name:'image',title: '插入图片',className: 'fa fa-picture-o',action:this.uploadimg}, '|',
                {name:'side-by-side',title: '全屏预览',className: 'fa fa-columns no-disable no-mobile',action:SimpleMDE.toggleSideBySide},
                {name:'fullscreen',title: '全屏预览',className: 'fa fa-arrows-alt no-disable no-mobile',action:SimpleMDE.toggleFullScreen},
                {name:'side-by-side',title: '预览',className: 'fa fa-eye no-disable',action:SimpleMDE.togglePreview}, '|',

            ],

            previewRender: function(plainText) {
                return marked(plainText,{
                    renderer: new marked.Renderer(),
                    gfm: true,
                    pedantic: false,
                    sanitize: false,
                    tables: true,
                    breaks: true,
                    smartLists: true,
                    smartypants: true,
                    highlight: function (code) {
                        return highlight.highlightAuto(code).value;
                    }
                });
            },
        });
        smde.codemirror.on("change", function(){
            var value = smde.value();
            self.content = value
        });


        if(this.$route.query.id){
            this.$http.post('/api/articleDetails', {
                id: this.$route.query.id
            }).then(
                respone => {
                    this.articleTitle = respone.body.title,
                    this.list.push({
                        tagName: respone.body.label
                    }),
                    smde.value(respone.body.articleContent)
                },
                respone => console.log(respone)
            )
        } else {

        }

        // 请求标签数据列表
        this.$http.get('/api/getArticleLabel').then(
            respone => {
                this.tags =  respone.body
            },
            respone => {
                Message.error('数据出错，请重新刷新页面')
            }
        )
    },
    methods: {
//        上传图片
        uploadimg:function(){
            console.log("1")
            this.show=!this.show

        },
        closeupload:function(){
            this.show=!this.show
        },
        handleRemove(file, fileList) {
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleSuccess(res){
            let urlitem=res.data.src;
            let markedurl='![]('+urlitem+')'
            this.imgurl.push(markedurl)
        },
        copy(key){
            document.getElementById(key).select();
            document.execCommand("Copy");
            this.$notify.success({
                title: '提示',
                message: '图片链接复制成功，请粘贴到编辑器中',
                offset: 100
            });
        },
        // 删除
        delectArticles:function(){
                this.$confirm('确定删除该文章吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/api/delect/article', {
                    _id : this.$route.query.id
                    }).then(
                        respone => {
                        this.$emit('saveArticleInformation');
                        this.$router.push('/articleList/articleEdit');
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$router.push('/admin');
                },
                respone => {
                    this.$message.error('删除失败请重试')
                })
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
    	// 保存草稿
    	saveDraft: function(){

            this.$confirm('确定保存该文章为草稿吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var self = this;
                if(this.$route.query.id){
                // 更新
                if(this.list.length>0){
                    var labelName = this.list[0].tagName;
                } else {
                    var labelName = '未分类'
                }
                var obj = {
                    _id: this.$route.query.id,
                    title: self.articleTitle,
                    articleContent: self.content,
                    date: new Date().format('yyyy-MM-dd hh:mm:ss'),
                    state: 'draft',
                    label: labelName
                }
                this.$http.post('/api/updateArticle',{
                    obj: obj
                }).then(
                        respone => {
                    Message.success('文章草稿保存成功')
                // 如果文章信息保存成功就给父组件派发一个事件通知它刷新文章列表
                self.$emit('saveArticleInformation')
            },
                respone => {
                    Message.error('文章草稿保存失败')
                }
            )
            } else {
                this.loading=true;
                if(this.list.length>0){
                    var labelName = this.list[0].tagName;
                } else {
                    var labelName = '未分类'
                    // 新建保存
                }
                var obj = {
                    title: self.articleTitle,
                    articleContent: self.content,
                    date: new Date().format('yyyy-MM-dd hh:mm:ss'),
                    state: 'draft',
                    label: labelName,
                    user:this.user,
                }
                this.$http.post('/api/saveArticle', {
                    articleInformation: obj
                }).then(
                        respone => {
                    this.loading=false;
                Message.success('文章保存成功')

                // 如果文章信息保存成功就给父组件派发一个事件通知它刷新文章列表
                self.$emit('saveArticleInformation')
            },
                respone => {
                    Message.error('文章保存失败')
                }
            )
            }
        }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
        },
        // 发布文章
        publishedArticles: function(){

            this.$confirm('确定发布该文章吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var self = this
                if(this.$route.query.id){
                // 更新
                if(this.list.length>0){
                    var labelName=[];
                    for (let i = 0;  i < this.list.length ; i ++) {
                        labelName.push(this.list[i].tagName)
                    }
                } else {
                    var labelName = '未分类'
                }
                var obj = {
                    _id: this.$route.query.id,
                    title: self.articleTitle,
                    articleContent: self.content,
                    date: new Date().format('yyyy-MM-dd hh:mm:ss'),
                    state: 'publish',
                    label: labelName,
                    tag : this.list[0].tagName
                }
                this.$http.post('/api/updateArticle',{
                    obj: obj
                }).then(
                        respone => {
                    Message.success('文章发布成功')
                // 如果文章信息保存成功就给父组件派发一个事件通知它刷新文章列表
                self.$emit('saveArticleInformation')
            },
                respone => {
                    Message.error('文章发布失败')
                }
            )
            } else {
                // 新建发布
                if(this.articleTitle===''){
                    this.$message({
                        message: '您还未填写文章标题',
                        type: 'warning'
                    });
                    return false;
                }
                else if(this.list.length===0){
                    this.$message({
                        message: '您还未选择文章标签',
                        type: 'warning'
                    });
                    return false;
                }
                else if(this.content===''){
                    this.$message({
                        message: '您还没有写任何内容哦',
                        type: 'warning'
                    });
                    return false;
                }
                this.loading1=true;
                //  文章内容
                var labelName=[];
                for (let i = 0;  i < this.list.length ; i ++) {
                    labelName.push(this.list[i].tagName)
                }
                var obj = {
                    title: self.articleTitle,
                    articleContent: self.content,
                    date: new Date().format('yyyy-MM-dd hh:mm:ss'),
                    state: 'publish',
                    label: labelName,
                    tag : this.list[0].tagName,
                    user:this.user,
                }
                console.log(obj)
                this.$http.post('/api/saveArticle', {
                    articleInformation: obj
                }).then(
                        respone => {
                    this.loading1=false;
                Message.success('文章发布成功')
                // 如果文章信息保存成功就给父组件派发一个事件通知它刷新文章列表
                self.$emit('saveArticleInformation')
            },
                respone => Message.error('文章发布失败')
            )
            }

        }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消发布'
            });
        });




        },
        selectTag: function(data){
            if(this.list.length<3){
                if(this.list.length==0){
                    this.list.push(data)
                }
                else {
                    for (let i=0;i<this.list.length;i++){
                        console.log(this.list.length)
                        console.log(data)
                        console.log(this.list[i].tagName)
                        if(this.list[i]==data){
                            this.$message('不能选择相同的标签哦');
                            return false;
                        }
                    }
                        this.list.push(data)
                }
            }else {
                this.$message('最多只能选择三个标签哦');
            }
        },
        handleClose: function(index) {
            console.log(index)
            this.list.splice(index, 1);
        }
    },
    directives: {

    }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
}
.fade-enter, .fade-leave-active {
    opacity: 0
}
#uploadbox{display:inline-block;padding:14px 20px;;background-color:rgba(0,0,0,.6); border-radius:4px; box-shadow:0px 0px 1px 1px rgba(0,0,0,.1);margin-left:10px; position:fixed; bottom:10px; padding-top:30px; padding-right:40px;z-index:99}
#closeupload{position:absolute; right:10px; top:10px;color:#fff; cursor:pointer}
.articel-edit-wrap {
    width: 100%;
    height: 100%;
}
.article-title { height: 45px; width:100%; background-color:#fff;
    border-bottom: 1px solid #f1f1f1;
}
.article-title > input {
    border: none;
    outline-style: none;
    width: 97%;
    height: 43px;
    padding-left: 10px;
    font-size: 20px;
}
.article-toolbar {
    height: 60px;
    line-height: 60px;
}
.label {
    width: 60%;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    float: left;
    display: table-cell;
    vertical-align: middle;
}
.label > img {
    vertical-align: middle;
    cursor: pointer;
}
.label > img:hover {
    border-bottom: 2px solid #20a0ff;
}
.tag-list-wrap {
    border: 1px solid #e0e6ed;
    padding: 5px;
    max-height: 150px;
    overflow: auto;
}
.tag-list-wrap > li {
    margin: 2px;
    padding: 3px;
    cursor: pointer;
    height: 30px;
    line-height: 36px;
}
.tag-list-wrap > li:hover {
    background-color: #e0e6ed;
}
.action-button {
    min-width: 120px;
    float: right;
    padding-right: 20px;
}
.CodeMirror {
    border-bottom: none!important;
    border-left: none!important;
    border-right: none!important;
    border-top: 1px solid #f1f1f1!important;
}
.editor-toolbar {
    border-top-left-radius: 0!important;
    border-top-right-radius: 0!important;
    border-left: none!important;
    border-right: none!important;
    opacity:1 !important;
}
.editor-statusbar {
    display: none;
}
.label .el-tag{ margin-right:5px;}
.tag-list-wrap li{ line-height:28px; font-size:14px;text-indent:10px;}
.el-tag{background-color:#3e4c5f; color:#fff;border:1px solid #3e4c5f; box-shadow:1px 1px 2px rgba(0,0,0,.3)}
.article-title{background-color:#171814;border:none !important}
.article-title > input{ font-size:18px;background-color:#3e4c5f;height:28px; border-radius:20px; width:60% !important; color:#eee;height:32px !important;margin-top:10px;margin-left:10px;padding-left:15px !important;}
.editor-toolbar{background-color:#2f3f51;opacity:1; border:none !important}
.editor-toolbar>a{background-color:#304052;margin-right:2px !important; outline:none}
.editor-toolbar a:before{color:#a4b5ce}
.editor-toolbar a:hover,.editor-toolbar a.active{background-color:#253443 !important;}
.editor-toolbar .separator{border-left:1px solid #a4b5ce !important;border-right:1px solid #a4b5ce !important}
.fullscreen{background-color:#2f3f51 !important;padding-left:40px !important;}
.editor-toolbar.fullscreen::before{display:none}
.article-title > input{ font-size:18px !important;}
.article-toolbar{background-color:#171814}
.addtag:hover{border:none !important}
.el-icon-close:hover{background-color:#171814 !important}
.el-icon-close{padding:2px}
.CodeMirror-scroll{min-height:800px !important}
.imgurl{list-style:none;overflow:hidden; margin-bottom:10px;}
.imgurl li{ width:146px;margin-right:10px;float:left;}
.imgurl li button{ display:block; margin:0 auto;  background-color: #3e4c5f; color: #fff; border-color: #3e4c5f;}
.imgurl li button:hover{ background-color: #22354e !important; border-color: #22354e !important;}
.imgurl input{ width:1px;margin-left:-1px}
</style>
