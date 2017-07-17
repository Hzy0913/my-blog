<template>
    <div id="tag" class="el-tabs__content">
        <h3>标签</h3>
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
            <el-col :xs="24" :sm="24" :md="24" :lg="12"  v-for="item in tagList" :key="item._id" class="artitem" >
                <div>
                    <div class="box-card articles-box" @click="articlesDetailsFn(item._id)">
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
            <div class="scrollbottomtip">
                <p :class="{ scrolltip: scrolltip }" style="position:relative;top:-15px">滚动加载更多</p>
                <div :class="{scrollload:scrollload,scrollloadlast:scrollloadlast}" >
                    <p>数据加载中</p>
                    <i class="el-icon-loading"></i>
                </div>
            </div>
        </el-row>
        <p :class="{'hide':lastpage}" class="lastpagetip">哼！我也是有底线的...</p>
        <!--<button style="background-color:red; width: 200px;height:40px; color:#fff;" @click="nextpage">下页</button>-->
    </div>
</template>

<script>
import { Loading } from 'element-ui';

export default {
    name: 'tag',
    data () {
        return {
            tagList: [],
            page:0,
            lastpage:true,
            first:true,
            scrollTop:0,
            tagname:'',
            ScrollFirst:true,
            scrolltip:false,
            scrollload:true,
            scrollloadlast:false,
            lastpage:true
        }
    },
    mounted () {

        console.log('啊啊211啊')
        this.tagList=this.$store.state.taglistcon;
        if(this.$store.state.taglistfirst){
            console.log('1111')
                let loadingInstance=Loading.service();
                let tag = this.$route.params.tag
                this.$http.get('/api/getArticleLabel/'+tag).then(
                        res => {
                    this.tagList = res.body;
        console.log('222221')
                    loadingInstance.close();
                    this.$store.commit('updatetaglistcon',this.tagList)
                },
                    res => {

                    }
                );

            this.first=false
            this.$store.commit('taglistfirst',this.first);
        };
        //        监听滚动
        window.addEventListener('scroll', this.handleScroll);
    },
    watch:{
        "$route": "taglist"
    },
    methods: {
//        监听路由变化后刷新列表
        taglist(){
            let loadingInstance=Loading.service();
            let tag = this.$route.params.tag
            this.$http.get('/api/getArticleLabel/'+tag).then(
                    res => {
                this.tagList = res.body;
            loadingInstance.close();
            this.lastpage=true;
            this.page=0;
            console.log(res)
        },
            res => {

            }
        )
        },
//        分页
        nextpage: function(){
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