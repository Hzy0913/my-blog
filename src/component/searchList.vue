<template>
    <div>

        <div id="tag">
            <div class="tagtitle">
                <p :class="{'fadetitle':fadetitle}">搜索有关于<span style="margin-left:10px;">"{{search}}"</span></p>
            </div>
            <div class="notfound" :class="{'notfoundis':notfound}">
                <div class="lw"></div>
                <div class="man"></div>
                <div class="radio"></div>
                <div class="notfoundtext" :class="{'searchnull':searchnull}"></div>
                <div class="notfoundtext1" :class="{'searchconnull':searchconnull}"></div>
                <div class="gj"></div>
            </div>
            <el-row :gutter="20" style="padding-bottom:12px">
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
                <el-col :xs="24" :sm="24" :md="24" :lg="12"  v-for="item in searchList" :key="item._id" class="artitem" >
                    <div @click="articlesDetailsFn(item._id)">
                        <div class="box-card articles-box" >
                            <div class="post-time">
                                <span class="post-timecon">{{new Date(item.date).format('yyyy-MM-dd')}}</span>
                            </div>
                            <div class="post-title" >
                                <h1>{{item.title}}</h1>
                            </div>
                            <div class="post-abstract">
                                {{item.articleContent}}
                            </div>
                        </div>
                        <div class="artitem_bottom">
                            <div class="avatar" v-for="list in item.user" :key="item.id">
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
                <!--<button style="background-color:red; width: 200px;height:40px; color:#fff;" @click="nextpage">下1一页</button>-->
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

                <!--<div class="scrollbottomtip">-->
                <!--<p :class="{ scrolltip: scrolltip }" style="position:relative;top:-15px;height:24px">滚动加载更多</p>-->
                <!--<div :class="{scrollload:scrollload,scrollloadlast:scrollloadlast}" >-->
                <!--<p>数据加载中</p>-->
                <!--<i class="el-icon-loading"></i>-->
                <!--</div>-->
                <!--</div>-->
            </el-row>

        </div>
    </div>


</template>

<script>
import { Loading } from 'element-ui';
//import Parallax from 'parallax-js'
export default {
    name: 'searchList',
    data () {
        return {
            searchList: [],
            search:'',
            firstcom:true,
            notfound:false,
            searchnull:false,
            searchconnull:false
        }
    },
    created :function(){
        this.searchList= []
        this.search=this.$store.state.search;
        this.fadetitle=true

        console.log(this.search);
        if(this.search==""){
            this.notfound=true
            this.searchnull=true
            this.searchconnull=true
            return;
        }
        let loadingInstance=Loading.service();
        //        执行搜索事件
        console.log("执行搜索事件")
        this.$http.get('/api/getArticleList/'+this.search).then(
                respone => {this.searchList=respone.body;loadingInstance.close();
                    if(this.searchList==0){
                        this.notfound=true

                    }else {
                        this.notfound=false
                    }

                },
                respone => console.log(respone)
        )

        //            接受兄弟组件派发事件
//        this.$root.eventbus.$on('showSearchlist',(target) => {
//
//            console.log('这里');
//            console.log(this.search);
//        this.search=target;
//            console.log('这里2');
//        });


//        this.searchList=[];
//        //        执行搜索事件
//        this.$http.get('/api/getArticleList/'+this.search).then(
//                respone => {this.searchList=respone.body;console.log( this.searchList)},
//        respone => console.log(respone)
//        )
    },
    watch:{
            search: function (val, oldVal) {
//                var first=this.firstcom;
                if(this.firstcom&&this.$store.state.searchRefresh){
                    this.firstcom=false;
                }else {
                    this.searchList=[];
                    //        执行搜索事件
                    let loadingInstance=Loading.service();
                    this.$http.get('/api/getArticleList/'+this.search).then(
                            respone => {this.searchList=respone.body;loadingInstance.close();
                    if(this.searchList==0){
                        this.searchnull=false
                        this.notfound=true
                    }else {
                        this.notfound=false
                    }
                    console.log( this.searchList)
                },
                            respone => console.log(respone)
                    )
                }
            }

    },
    mounted :function() {
//                    接受兄弟组件派发事件
        this.$root.eventbus.$on('showSearchlist',(target) => {
            this.search=target;
        });
//        this.$root.eventbus.$on('showSearchlist',(target) => {
//
//            console.log('这里');
//            console.log(this.search);
//            this.search=target;
//            console.log('这里2');
//         });

//        searchart()
//        this.searchList=[];
//        //        执行搜索事件
//        this.$http.get('/api/getArticleList/'+this.search).then(
//                respone => {this.searchList=respone.body;console.log( this.searchList)},
//                respone => console.log(respone)
//        )



    },
    methods: {
        searchart : function(){
            console.log(this.search)
//            this.$root.eventbus.$on('showSearchlist',(target) => {
//                    this.search='';
//                this.search=target;
//                console.log('2222222222222222222');
//                console.log(this.search);
//                this.searchList=[];
//                //        执行搜索事件
//                this.$http.get('/api/getArticleList/'+this.search).then(
//                        respone => {this.searchList=respone.body;console.log( this.searchList)},
//                respone => console.log(respone)
//                )
//            });
        },
        //       id文章页面
        articlesDetailsFn: function(id){
            this.$router.push({ name: 'details', params: { id: id }})
            // this.$router.push('articlesDetails'+id+'')
        }
    }
}
</script>

<style scoped>
@import "../style/common.css";
#tag{padding:0px 30px;}
.notfound{background-color:#b8dce8; width:120%;height:550px;margin-left:-10%;position:relative;display:none}
.lw{ width:252px;height:132px;background:url("../assets/lw.png") no-repeat;background-size:contain;position:absolute;left:10%;top:10%}
.man{ width:220px;height:240px;background:url("../assets/man.png") no-repeat;background-size:contain;position:absolute; bottom:0px;left:20%}
.radio{ width:468px;height:468px;background:url("../assets/radio.png") no-repeat;background-size:contain;position:absolute;right:20%;}
.notfoundtext{width:360px;height:50px;background:url("../assets/notfoundtext1.png") no-repeat;background-size:contain;position:absolute; top:80px;right:20%;top:22%}
.notfoundtext1{width:180px;height:68px;background:url("../assets/tip1.png") no-repeat;background-size:contain;position:absolute;right:32%;top:46%}
.gj{width:380px;height:108px;background:url("../assets/gj.png") no-repeat;background-size:contain;position:absolute;right:32%;bottom:0%}
.searchnull{background:url("../assets/searchnull.png") no-repeat !important;background-size:contain !important}
.notfoundis{display:block !important}
.searchconnull{background:url("../assets/searchconnull.png") no-repeat !important;background-size:contain !important;width:204px !important;right:30% !important}
</style>