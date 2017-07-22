<template>
    <div id="app">
        <el-row :gutter="0" >
            <el-col class="nav" >
                 <el-col class="nav-bar" :sx="22" :sm="22" :md="20" :lg="16">
                    <div class="mobile-nav-bar" v-show="isShowMobileNavBar">
                        <!--<ul>-->
                            <!--<li @click="latestArticles" v-bind:class="{current: $route.path== '/'}">-->
                                <!--<span>1最新文章</span>-->
                            <!--</li>-->
                            <!--<li @click="archives" v-bind:class="{current: $route.path== '/archives'}">-->
                                <!--<span style="border-left: 1px solid #ddd;">文章归档</span>-->
                            <!--</li>-->
                            <!--<li @click="tag" v-bind:class="{current: $route.path== '/tag'}">-->
                                <!--<span>文章标签</span>-->
                            <!--</li>-->
                            <!--<li @click="about" v-bind:class="{current: $route.path== '/about'}">-->
                                <!--<span style="border-left: 1px solid #ddd;">关于我的</span>-->
                            <!--</li>-->
                        <!--</ul>-->
                    </div>
                    <div class="nav-bar-body">
                        <div class="nav-bar-inner">
                            <span>binlive</span>
                            <div>
                                <i class="el-icon-menu" @click="navBar"></i>
                            </div>
                        </div>
                        <ul>
                            <li @click="latestArticles" v-bind:class="{borderRightActive: $route.path=='/'}">11最新文章</li>
                            <li @click="archives" v-bind:class="{borderRightActive: $route.path=='/archives'}">文章归档</li>
                            <li @click="tag" v-bind:class="{borderRightActive: $route.path=='/tag'}">文章标签</li>
                            <li @click="about" v-bind:class="{borderRightActive: $route.path=='/about'}">关于我的</li>
                            <div id="search">
                                <el-input  placeholder="搜索" icon="search"  :on-icon-click="searchArticle"  v-model="search" @keyup.enter.native="keyupsearch($event)">
                                </el-input>
                            </div>
                            <el-button type="primary" icon="edit" id="addacticlebtn">发稿</el-button>
                        </ul>
                    </div>
                    <div class="navmenu">
                        <template>
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane   label='最新' name="" class="is-active"  ></el-tab-pane>
                                <el-tab-pane  v-for="item in taglists" :label='item' :name="item" data-ripple></el-tab-pane>
                            </el-tabs>
                        </template>

                        <!--<el-tabs  @tab-click="handleClick">-->
                            <!--<el-tab-pane>用户管理</el-tab-pane>-->
                            <!--<el-tab-pane v-for="item in taglists" >-->
                                <!--&lt;!&ndash;<router-link  :to="'/'+item"   >{{item}}</router-link>&ndash;&gt;-->
                                <!--{{item}}-->
                            <!--</el-tab-pane>-->
                        <!--</el-tabs>-->
                        <!--<ul >-->
                            <!--<router-link v-for="item in taglists"  :to="'/'+item"   >{{item}}</router-link>-->

                        <!--</ul>-->
                    </div>
                </el-col>
            </el-col>
            <el-col :xs="24" :sm="22" :md="20" :lg="16" class="container_article">
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
            search:'',
            activeName: '',
            searchRefreshfirst:true,
        }
    },
    directives: {},
    mounted(){
        this.taglist();

        console.log( this.$store.state.scrollTop)
        console.log(this.$store.state.headerTitle)
    },
    methods: {
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
        }
    }
}
</script>
<style>
    @import './style/common.css';
</style>