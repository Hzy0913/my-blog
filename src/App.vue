<template>
    <div id="app">
        <el-row :gutter="0" >
            <el-col class="nav" >
                 <el-col class="nav-bar" :sx="22" :sm="22" :md="22" :lg="16">
                    <div class="mobile-nav-bar" v-show="isShowMobileNavBar">
                    </div>
                    <div class="nav-bar-body">
                        <div class="nav-bar-inner">
                            <div id="logo">
                                <img src="../dist/logo.png" alt="">
                            </div>
                        </div>
                        <div>
                            <a href="http://www.binlive.cn/my" target="_blank" id="avatar">
                                <img src="https://avatars1.githubusercontent.com/u/22450881?v=4" alt="">
                            </a>
                            <div id="search">
                                <el-input  placeholder="搜索"  icon="search"  :on-icon-click="searchArticle"  v-model="search" @keyup.enter.native="keyupsearch($event)">
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <div class="navmenu">
                        <template>
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane   label='最新' name="" class="is-active"  ></el-tab-pane>
                                <el-tab-pane  v-for="item in taglists" :label='item' :name="item" data-ripple></el-tab-pane>
                            </el-tabs>
                            <el-button type="primary" icon="edit" id="addacticlebtn" @click="loginpage">发稿</el-button>
                        </template>
                    </div>
                </el-col>
            </el-col>
            <el-col :xs="24" :sm="22" :md="22" :lg="16" class="container_article">
                <div class="main">
                    <!--<transition name="fade" mode="out-in">-->
                        <keep-alive include="latestArticles,searchList" exclude="details">
                            <router-view></router-view>
                        </keep-alive>
                        <!--<router-view v-if="$route.meta.keepAlive == false"></router-view>-->
                    <!--</transition>-->
                </div>
            </el-col>
        </el-row>
        <div class="footer">京ICP备17044565号</div>
    </div>
</template>
<script>
import { Message } from 'element-ui';
export default {
    name: 'app',
    data () {
        return {
            isShowMobileNavBar: false,
            taglists: [],
            search:null,
            activeName: '',
            searchRefreshfirst:true,
            mobile:false
        }
    },
    directives: {},
    mounted(){
        this.taglist();
        var winwinth=window.innerWidth
        if(winwinth<700){
            this.mobile=true
        }
        if(this.$route.params.tag==undefined){
            this.activeName='';
        }else {
            this.activeName=this.$route.params.tag;
        }
    },
    watch:{
        "$route": "linkactive"
    },
    methods: {
        linkactive(){
            if(this.$route.params.tag==undefined){
                this.activeName='';
            }else {
                this.activeName=this.$route.params.tag;
            }
        },
        taglist () {
            this.$http.get('/api/getArticleLabel').then(
            respone => {
              for (let i=0; i<respone.body.length; i++){
                this.taglists.push(respone.body[i].tagName)
              }
            console.log(this.taglists)
            },
            respone => console.log(respone)
            )
        },
        keyupsearch:function(ev){
            if(ev.keyCode == 13){
               this.searchArticle()
            }
        },
        handleClick(tab) {
            this.$router.push({path:'/'+tab.name})
            this.$root.eventbus.$emit('tabname',tab.name);
            this.$store.commit('updatetagtitle',tab.name)

        },
        latestArticles: function () {
            this.$router.path('/')
        },
        archives: function () {
            this.$router.push('archives')
        },
        tag: function () {
            this.$router.push('tag')
        },
        about: function () {
            this.$router.push('about')
        },
//        触发搜索事件
        searchArticle: function () {
//           派发事件给兄弟组件
            if(this.search==""){
                this.$notify.info({
                    title: '提示',
                    message: '您还未输入搜索内容',
                    offset: 100
                });
                return
            }
            this.$store.commit('search',this.search)
            if(this.searchRefreshfirst){
                this.searchRefreshfirst=false;
                this.$store.commit('searchRefresh',false)
            }
            this.$root.eventbus.$emit('showSearchlist', this.search);
            this.$router.push({path:'/search'})
        },
        navBar: function () {
            let result = window.matchMedia('(min-width: 768px)')
            if (result.matches)return;
            if (this.isShowMobileNavBar) {
                this.isShowMobileNavBar = false
                var navBar = document.querySelector('.nav-bar')
                navBar.style.height = 8 + 'vh'
                navBar.style.transition = '0.5s'
            } else {
                this.isShowMobileNavBar = true
                var navBar = document.querySelector('.nav-bar')
                navBar.style.height = 20 + 'vh'
                navBar.style.transition = '0.5s'
            }
        },
        loginpage:function(){
            window.open("http://www.binlive.cn/admin")
        }
    }
}
</script>
<style>
    @import './style/common.css';
</style>