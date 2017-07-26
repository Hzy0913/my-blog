<template>
    <div id="app">
        <div class="left-sidebar">
            <div class="admin-logo icons">
                <svg class="icon" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-icon-test3"></use>
                </svg>
            </div>
            <div class="article-logo icons" style="cursor:pointer" @click="articleList">
                <svg class="icon" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-icon-test1"></use>
                </svg>
                <p>文章</p>
            </div>
            <div class="label-logo icons" style="cursor:pointer" @click="articleLabel">
                <svg class="icon" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-icon-test"></use>
                </svg>
                <p>标签</p>
            </div>
            <div class="use-logo icons" style="cursor:pointer" @click="examineList">
                <svg class="icon" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-icon-test3"></use>
                </svg>
                <p>审核</p>
            </div>
        </div>
        <div class="article-list-wrap">
            <transition  mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {

        }
    },
    mounted: function(){

    },
    methods: {
        // 文章列表路由
        articleList: function(){
            this.$router.push('/articleList')
        },
        // 文章标签路由
        articleLabel: function(){
            this.$router.push('/atricleLabel')
        },
        // 个人中心
        personalCenter: function(){
            this.$router.push('/personalCenter')
        },
        examineList: function(){
            this.$router.push('/examineList')
        }
    },
    directives: {

    }
}
</script>

<style>
* {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
body {
    position: relative;
    background-color:#f3f3f5;
}
pre {
    background-color: #f5f5f5;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    margin: 10px 0 10px 0;
    overflow-x: auto;
}
blockquote {
    border-left: 10px #e4e9eb solid;
    background-color: #f5f5f5;
    padding: 15px 20px;
    margin: 10px 0 10px 0;
}
strong {
    color: #579eff;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    width: 100%;
    overflow: hidden;
}
.left-sidebar {
    width: 90px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    border-right: 1px solid #f1f1f1;
    background-color: #2f3f51;
}
.admin-logo {
    width: 100%;
    height: 140px;
    padding-top:20px;
    margin: 0 auto;
    background-color:#253443;
}
.admin-logo > img {
    overflow: hidden;
    display: block;
    margin: 0 auto;
}
.article-logo {
    height: 100px;
    margin-top: 50px;
}
.article-logo > img {
    display: block;
    margin: 0 auto;
    cursor: pointer;
}
.label-logo {
    height: 100px;
    margin-top: 20px;
}
.label-logo > img {
    display: block;
    margin: 0 auto;
    cursor: pointer;
}
.use-logo {
    height: 100px;
    margin-top: 20px;
}
.use-logo > img {
    display: block;
    margin: 0 auto;
    cursor: pointer;
}
.sidebar-switch {
    height: 100px;
    position: absolute;
    bottom: 30px;
    left: 0;
}
.sidebar-switch > img {
    display: block;
    margin: 0 auto;
}
.article-list-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}
.admin-logo svg{ width:50px;height:50px;margin:0 auto;display:block}
.article-logo svg{ width:50px;height:50px;margin:0 auto;display:block; cursor:pointer}
/*code*/
/*pre{background-color:#272822 !important;overflow:inherit !important; font-size:16px;position:relative;padding-left:42px !important; }*/
/*pre:before{content:'';height:100%; width:28px; background-color:#373737;display:block;position:absolute; left:0px; top:0px;border-radius:0px 5px 5px 0px;overflow:hidden; box-shadow:1px 0px 2px rgba(36,36,36,.2)}*/
/*pre code{color:#fff;font-weight:900}*/
/*滚动条样式*/
::-webkit-scrollbar { width: 9px; height: 9px; }
::-webkit-scrollbar-track-piece { background-color: transparent; }
body::-webkit-scrollbar-track-piece { background-color: rgba(0,0,0,.2); }
::-webkit-scrollbar-track-piece:no-button {}
::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,.6); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background-color:#454545; }
::-webkit-scrollbar-thumb:active { background-color: #323232; }
::-webkit-scrollbar-button:vertical { width: 9px; }
::-webkit-scrollbar-button:horizontal { width: 9px; }
::-webkit-scrollbar-button:vertical:start:decrement { background-color: #cccccc; }
::-webkit-scrollbar-button:vertical:end:increment { background-color: #cccccc; }
::-webkit-scrollbar-button:horizontal:start:decrement { background-color:  #cccccc; }
::-webkit-scrollbar-button:horizontal:end:increment { background-color:  #cccccc; }

.icon { vertical-align: -0.15em;padding-top:10px; fill: currentColor; overflow: hidden;width:46px;height:46px;margin:0 auto;display:block }
.icons:hover{background-color:#1d3247}
.icons p{ font-size:16px;text-align:center;color:#fff;margin-top:4px;}
</style>
