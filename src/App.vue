<template>
    <div id="app">
        <el-row :gutter="0" >
            <el-col class="nav" >
                 <el-col class="nav-bar" :lg="16">
                    <div class="mobile-nav-bar" v-show="isShowMobileNavBar">
                        <ul>
                            <li @click="latestArticles" v-bind:class="{current: $route.path== '/'}">
                                <span>1最新文章</span>
                            </li>
                            <li @click="archives" v-bind:class="{current: $route.path== '/archives'}">
                                <span style="border-left: 1px solid #ddd;">文章归档</span>
                            </li>
                            <li @click="tag" v-bind:class="{current: $route.path== '/tag'}">
                                <span>文章标签</span>
                            </li>
                            <li @click="about" v-bind:class="{current: $route.path== '/about'}">
                                <span style="border-left: 1px solid #ddd;">关于我的</span>
                            </li>
                        </ul>
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
                                <input type="text" placeholder="搜索" v-model="search">
                                <button @click="searchArticle">搜索 啊</button>
                            </div>
                        </ul>
                    </div>
                    <div class="navmenu">
                        <ul >
                            <router-link v-for="item in taglists"  :to="'/'+item"   >{{item}}</router-link>
                        </ul>
                    </div>
                </el-col>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="16" class="container_article">
                <div class="main">
                    <transition name="fade" mode="out-in">
                        <!--<keep-alive include="latestArticles">-->
                            <router-view></router-view>
                        <!--</keep-alive>-->
                        <!--<router-view v-if="$route.meta.keepAlive == false"></router-view>-->
                    </transition>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {
            isShowMobileNavBar: false,
            taglists: [],
            search:''
        }
    },
    directives: {},
    mounted(){
        this.taglist()
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
        latestArticles: function () {
            this.$router.push('/')
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
        searchArticle: function () {
            console.log(this.search)
            this.$http.get('/api/getArticleList/'+this.search).then(
                    respone => {
                console.log(respone.body)
             },
            respone => console.log(respone)
            )
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