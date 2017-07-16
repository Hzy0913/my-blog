<template>
    <div>

        <!--<el-row :gutter="20">-->
            <!--<el-col :xs="22" :sm="22" :md="20" :lg="20" :push="1">
                <div class="main-header">
                    <span>最新文章</span>
                    <el-input class="search"
                        icon="search">
                    </el-input>
                </div>
            </el-col>-->

            <!--<el-col :xs="22" :sm="22" :md="20" :lg="24" >-->
                <div class="grid-content bg-purple">
                    <el-tabs>
                        <el-tab-pane label="最新文章">

                            <el-row :gutter="20">
                                <!--<el-col :xs="24" :sm="24" :md="24" :lg="18" >-->
                                    <!--<el-card class="box-card articles-box" @click="articlesDetailsFn(item._id)">-->
                                        <!--<div class="post-title" >-->
                                            <!--<h1>文章标题</h1>-->
                                            <!--<span class="post-label">分类</span>-->
                                            <!--<div class="post-time">-->
                                                <!--<span class="post-timecon">2017-06-04</span>-->
                                            <!--</div>-->
                                        <!--</div>-->

                                        <!--<div class="post-abstract" v-compiledMarkdown>-->
                                            <!--文章描述文章描述秒文章描述文章描述秒文章描述文章描述秒文章描述文章描述秒文章描述文章描述秒-->
                                        <!--</div>-->
                                    <!--</el-card>-->
                                <!--</el-col>-->
                                <el-col :xs="24" :sm="24" :md="24" :lg="12"  v-for="item in articleList" :key="item._id" class="artitem" >
                                    <div>
                                        <div class="box-card articles-box" @click="articlesDetailsFn(item._id)">
                                            <div class="post-title" >
                                                <h1>{{item.title}}</h1>

                                                <div class="post-time">
                                                    <span class="post-timecon">{{new Date(item.date).format('yyyy-MM-dd')}}</span>
                                                </div>
                                            </div>

                                            <div class="post-abstract" v-compiledMarkdown>
                                                {{item.articleContent}}
                                            </div>

                                        </div>
                                        <div class="artitem_bottom">
                                            <div class="avatar" v-for="list in item.user">
                                                <a :href=list.html_url target="_blank">
                                                    <img :src=list.avatar_url alt="">
                                                    <p>{{list.name}}</p>
                                                </a>
                                            </div>
                                            <div class="post-label-box">
                                                <span class="post-label" v-for="list in item.label">{{list}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <button style="background-color:red; width: 200px;height:40px; color:#fff;" @click="nextpage">下1一页</button>
                                <!--<el-col :xs="24" :sm="12" :md="12" :lg="12" v-for="item in articleList" :key="item._id">-->
                                    <!--<el-card class="box-card articles-box">-->
                                        <!--<div class="post-title" @click="articlesDetailsFn(item._id)">-->
                                            <!--{{item.title}}-->
                                        <!--</div>-->
                                        <!--<div class="post-time">-->
                                            <!--{{new Date(item.date).format('yyyy-MM-dd hh:mm:ss')}}-->
                                            <!--<span class="post-label">{{item.label}}</span>-->
                                        <!--</div>-->
                                        <!--<div class="post-abstract" v-compiledMarkdown>-->
                                            <!--{{item.articleContent}}。-->
                                        <!--</div>-->
                                    <!--</el-card>-->
                                <!--</el-col>-->
                                <p >滚动加载更多</p>
                            </el-row>
                            <p :class="{'hide':lastpage}">没有更多数据了呢...</p>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            <!--</el-col>-->
        <!--</el-row>-->
    </div>
</template>

<script>
import { Loading } from 'element-ui';
import marked from 'marked';
import highlight from 'highlight.js'
import '../assets/atom-one-light.css'
export default {
    name: 'latestArticles',
    data(){
        return {
            articleList: [],
            page:0,
            lastpage:true,
            first:true
        }
    },
    created(){


    },
    mounted(){
        console.log('啊啊啊')
        this.articleList=this.$store.state.newlistcon
        if(this.$store.state.newlistfirst){
            let loadingInstance = Loading.service({ fullscreen: true });
            this.$http.get('/api/articleList').then(
                    res => {
                console.log(res.body)

            this.articleList = res.body;
            loadingInstance.close();
            this.$store.commit('updatenewlistcon',this.articleList)
            this.first=false
            this.$store.commit('newlistfirst',this.first);
            // let a = res.body[2].articleContent.replace(/[^\u4e00-\u9fa5]/gi,'')
        },
            res => {
                console.log(res)
            }
        );

        }
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
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code) {
                return highlight.highlightAuto(code).value;
            }
        })

//        监听滚动
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        articlesDetailsFn: function(id){
            console.log("12123")

            this.$router.push({ name: 'details', params: { id: id }})
            // this.$router.push('articlesDetails'+id+'')
        },
//        分页
        nextpage: function(){
            if(this.lastpage){
                this.page++
                var page=this.page;
                this.$http.get('/api/articleList/'+page).then(
                        res => {
                    console.log(res.body)
                let arrcon=this.articleList
                let arrnew=res.body
                let arrconlast=arrcon.concat(arrnew);
                this.articleList=arrconlast
                if(res.body.length<10){
                    this.lastpage=false;
                }
                console.log("这里")
                console.log(arrconlast)
                console.log(this.articleList.length)
                this.$store.commit('updatenewlistcon',this.articleList);
                this.articleList=this.$store.state.newlistcon
                console.log(this.$store.state.newlistcon)
                },
                    res => {
                        console.log(res)
                    }
                )
            }
        },
//        监听滚动
        handleScroll () {
            let scrollBottom=document.body.clientHeight-window.innerHeight -document.body.scrollTop
            if(scrollBottom<100){
                console.log("小了")
            }
        }
    },
    directives: {
        compiledMarkdown: {
            bind: function(el){
                el.innerHTML = marked(el.innerText)
                el.innerHTML = el.innerHTML.replace(/[^\u4e00-\u9fa5]/gi,'')

                if(el.querySelector('pre')){
                    el.querySelector('pre').style.display = "none"
                }
                if(el.querySelector('blockquote')){
                    el.querySelector('blockquote').style.display = "none"
                }
            }
        }
    },
}
</script>

<style scoped>
@import '../style/latestArticles.css';
.hide{display:none}
.el-tab-pane .el-row{padding-bottom:60px;}
</style>
