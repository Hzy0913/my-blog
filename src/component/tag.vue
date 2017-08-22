<template>
    <div id="tag" class="el-tabs__content">
        <div class="tagtitle">
            <p :class="{'fadetitle':fadetitle}">{{tagtitle}}</p>
        </div>
        <!--<div v-for="item in tagList">-->
            <!--<div class="box-card articles-box" @click="articlesDetailsFn(item._id)">-->
                <!--<div class="post-title" >-->
                    <!--<h1>{{item.title}}</h1>-->
                    <!--<span v-for="list in item.label" class="post-label">{{list}}</span>-->
                    <!--<div class="post-time">-->
                        <!--<span class="post-timecon">{{new Date(item.date).format('yyyy-MM-dd')}}</span>-->
                    <!--</div>-->
                <!--</div>-->

                <!--<div class="post-abstract" >-->
                    <!--{{item.articleContent}}-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
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
            <el-col :xs="24" :sm="24" :md="12" :lg="12"  v-for="item in tagList" :key="item._id" class="artitem" >
                <div @click="articlesDetailsFn(item._id)">
                    <div class="box-card articles-box" >
                        <div class="post-time">
                            <span class="post-timecon">{{new Date(item.date).format('yyyy-MM-dd')}}</span>
                        </div>
                        <div class="post-title" >
                            <h1>{{item.title}}</h1>
                        </div>
                        <div class="post-abstract" v-compiledMarkdown>
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

        </el-row>
        <div class="scrollbottomtip" :class="{'scrollbottomtipno':scrollbottomtipno}">
            <p :class="{ scrolltip: scrolltip }" style="position:relative;top:-15px;height:24px">滚动加载更多</p>
            <div :class="{scrollload:scrollload,scrollloadlast:scrollloadlast}" >
                <p>数据加载中</p>
                <i class="el-icon-loading"></i>
            </div>
        </div>
        <p :class="{'hide':lastpage}" class="lastpagetip">(ง •̀_•́)ง       没有更多数据了哦...</p>
        <!--<button style="background-color:red; width: 200px;height:40px; color:#fff;" @click="nextpage">下页</button>-->
    </div>
</template>

<script>
import { Loading } from 'element-ui';
import marked from 'marked';
export default {
    name: 'tag',
    data () {
        return {
            tagList: [],
            tagtitle:'',
            page:0,
            lastpage:true,
            first:true,
            scrollTop:0,
            tagname:'',
            ScrollFirst:true,
            scrolltip:false,
            scrollload:true,
            scrollloadlast:false,
            lastpage:true,
            fadetitle:false,
            scrollbottomtipno:false,
        }
    },
    mounted () {

        this.tagList=this.$store.state.taglistcon;
        console.log( this.tagList)
//       document.body.scrollTop=100
//        console.log(document.body.scrollTop)
        if(this.$store.state.taglistfirst){
            console.log('here1')
            let loadingInstance = Loading.service({ fullscreen: true });

                let tag = this.$route.params.tag
                this.$http.get('/api/getArticleLabel/'+tag).then(
                        res => {
                    console.log('here2')

            if(res.body.length<10){
                        this.scrollbottomtipno=true;
                    }
                    this.tagList = res.body;
                    this.tagtitle=this.$store.state.tagtitle
                    this.fadetitle= true
            console.log('here3')

            loadingInstance.close();
                    this.$store.commit('updatetaglistcon',this.tagList)
                    },
                    res => {

                    }
                );
            this.fadetitle= true
            this.first=false
            this.$store.commit('taglistfirst',this.first);
        };
        //        监听滚动
        window.addEventListener('scroll', this.handleScroll);
//        jieshou
        this.$root.eventbus.$on('tabname',(target) => {
            console.log(target)

        this.$store.commit('updatetagtitle',target);
        console.log('aklsadknas,dnas')
            console.log(this.$store.state.tagtitle)
        this.tagtitle=this.$store.state.tagtitle
        console.log(this.tagtitle)

        this.udead()

        });

        this.tagtitle=this.$store.state.tagtitle
//        this.taglist()

        this.fadetitle=true
        console.log('12123卡时间段卡时间段卡时间段')
        console.log(this.tagtitle)
    },
    watch:{
        "$route": "taglist"
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
    beforeEnter: (to, from, next) => {
        console.log('beforeEnter')
    },
    afterEnter: (to, from) => {
        console.log('afterEnter')
    },
    methods: {
//        监听路由变化后刷新列表
        udead(){
            console.log('监听路由变化后刷新列表')
            console.log(this.$store.state.tagtitle)
            this.tagtitle=this.$store.state.tagtitle
            this.tagList=this.$store.state.taglistcon
            console.log('监听路由变化后刷新列表11111111')
            console.log(this.tagtitle)
            console.log("111")
            document.title ='binlive-'+this.tagtitle
            this.$store.commit('updatetaglistcon',[]);
            this.$store.commit('taglistfirst',true);



        },
        taglist(){
            this.$store.commit('updatetaglistcon',[])
            console.log(this.$store.state.taglistcon)
            this.fadetitle= false;
            let loadingInstance=Loading.service();
            let tag = this.$route.params.tag
            console.log("奥斯卡撒昆明大上课没打算考虑的马萨看到了吗")
            this.$http.get('/api/getArticleLabel/'+tag).then(
                    res => {
                if(res.body.length<10){
                    this.scrollbottomtipno=true;
                }
                this.tagList = res.body;
                this.tagtitle=this.$store.state.tagtitle


            loadingInstance.close();
            this.lastpage=true;
            this.ScrollFirst=true;
            this.fadetitle= true

            this.page=0;
            console.log( this.lastpage)
        },
            res => {

            }
        )
        },
//        分页
        nextpage: function(){
            console.log(this.lastpage)
            let tag = this.$route.params.tag
            if(this.lastpage){
                this.page++
                var page=this.page;
                this.$http.get('/api/getArticleLabel/'+tag+'/'+page).then(
                        res => {
                    console.log(1111)
                    console.log(res.body)
                let arrcon=this.tagList
                let arrnew=res.body
                let arrconlast=arrcon.concat(arrnew);
                this.tagList=arrconlast
                this.ScrollFirst=true;
                this.scrolltip=false;
                this.scrollload=true;
                if(res.body.length<10){
                    this.lastpage=false;
                    this.scrolltip=true;
                    this.scrollloadlast=true;
                }
                this.$store.commit('updatetaglistcon',this.tagList)
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
            if(scrollBottom<10){
                if(this.ScrollFirst){
                    this.scrolltip=true;
                    this.scrollload=false;
                    this.ScrollFirst=false;
                    this.nextpage()
                }

            }
        },
        //       id文章页面
        articlesDetailsFn: function(id){
            console.log("12123")

            this.$router.push({ name: 'details', params: { id: id }})
            // this.$router.push('articlesDetails'+id+'')
        }
    }
}

</script>

<style scoped>

</style>