<template>
    <div class="article-label-wrap">
        <div class="article-label-nav">
            <div class="article-instructions">
                <i class="el-icon-star-on"></i>
                <span>标签</span>
                <i class="el-icon-plus" height="16" width="18" style="overflow:hidden;cursor:pointer"  @click="addArticLabel"></i>
            </div>
            <ul>
                <li v-for="item in articleLabel" >
                    <i class="el-icon-delete" @click="deletetag(item.tagName)"></i>
                    <h3 class="articleLabel-title" @click="labelClassification(item.tagName)">{{item.tagName}} <span style="color:#7e7e7e;">({{item.tagNumber}})</span></h3>
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
export default{
    data(){
        return{
            articleLabel: [

            ],
            tagName: '',
            isTagInputShow: false
        }
    },
    mounted: function(){
        // 请求标签数据列表
        this.$http.get('/api/getArticleLabel').then(
            respone => {
                this.articleLabel =  respone.body
            },
            respone => {
                Message.error('请求数据出错，请重新刷新页面')
            }
        )
    },
    methods: {
        deletetag: function(tagName){
            this.$confirm("是否确定删除"+tagName+"标签", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/api/delect/tag', {
                    tagName : tagName
                    }).then(
                         respone => {
                            console.log(tagName)
                            this.$message('删除成功')
        //                  删除组中的tag
                            for(var i=0; i<this.articleLabel.length; i++) {
                                console.log(this.articleLabel[i])
                                if(this.articleLabel[i].tagName == tagName) {
                                    this.articleLabel.splice(i, 1);
                                    break;
                                }
                            }
        //                    this.$emit('saveArticleInformation'),
        //                    this.$router.push('/articleList/articleEdit')
                },
                          respone => {
                             this.$message.error('删除失败请重试')
                          }
                )

            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });
                });

        },
        labelClassification: function(title){
            localStorage.setItem("lebelTitle",title)
            this.$router.push('/articleList')
        },
        addArticLabel: function(){
            this.$prompt('请输入要添加的标签', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                    var obj = {
                        tagName:value,
                        tagNumber: 0
                    }
                        this.$http.post('/api/saveArticleLabel',{
                            tagList: obj
                        }).then(
                                respone => {
                            if(respone.body.error){
                            Message.error(respone.body.msg);
                            return;
                        }
                        Message.success('标签保存成功')
                        this.articleLabel.push(obj)
                    },
                    respone => Message.error('标签保存失败')
                    )
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
            this.isTagInputShow = true;
        },
    directives: {
        articleListHeight: {
            bind: function(el){
                var height = window.innerHeight - 120
                el.style.maxHeight = height + 'px'
            }
        }
    }
}}
</script>

<style>
.article-label-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: 90px;
}
.article-label-nav {
    width: 230px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 90px;
    border-right: 1px solid #f1f1f1;
    z-index: 1;
    background-color: #fff;
}
.article-label-nav > ul {
    overflow: auto;
    padding-left: 22px;
    padding-right: 22px;
}
.article-label-nav > ul > li {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    padding: 5px 10px 5px 10px; position:relative;
}
.article-label-nav > ul > li > img {
    display: block;
    float: left;
    padding-top: 13px;
    padding-right: 5px;
}
.article-label-nav > ul > li > h3 {
    width: 170px;
    padding: 15px 10px 15px 2px;
    display: inline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #00b692;
    font-size:16px;
}
.tagName-input {
    margin: 5px 5px 0px;
    position: absolute;
    bottom: 13px
}
.el-icon-delete{cursor:pointer;color:#999;position:absolute; right:4px; top:16px;display:none}
.el-icon-delete:hover{color:#f7ba2a;}
.article-label-nav > ul > li:hover .el-icon-delete{display:block}
.articleLabel-title:hover{color:#243342}
</style>
