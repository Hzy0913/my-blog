<template>
    <div id="tag">
        <h3>标签</h3>
        <div v-for="item in tagList">
            <div class="box-card articles-box" @click="articlesDetailsFn(item._id)">
                <div class="post-title" >
                    <h1>{{item.title}}</h1>
                    <span v-for="list in item.label" class="post-label">{{list}}</span>
                    <div class="post-time">
                        <span class="post-timecon">{{new Date(item.date).format('yyyy-MM-dd')}}</span>
                    </div>
                </div>

                <div class="post-abstract" >
                    {{item.articleContent}}
                </div>
            </div>
        </div>
        <button style="background-color:red; width: 200px;height:40px; color:#fff;" @click="nextpage">下页</button>
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
            tagname:''
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
        }
    },
    watch:{
        "$route": "taglist"
//        tagname: function (val, oldVal) {
//
//            let loadingInstance=Loading.service();
//            let tag = this.$route.params.tag
//            this.$http.get('/api/getArticleLabel/'+tag).then(
//                    res => {
//                this.tagList = res.body;
//            console.log('222221')
//            loadingInstance.close();
//            this.$store.commit('updatetaglistcon',this.tagList)
//             },
//            res => {
//
//            }
//            );
//
//
//
//        }
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
                    console.log(res.body)
                let arrcon=this.tagList
                let arrnew=res.body
                let arrconlast=arrcon.concat(arrnew);
                this.tagList=arrconlast
                if(res.body.length<10){
                    this.lastpage=false;
                }
                this.$store.commit('updatetaglistcon',this.tagList)
                console.log("这里")
                console.log(arrconlast)
                console.log(this.tagList.length)
            },
                res => {
                    console.log(res)
                }
            )
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
#tag {
    text-align: center;
    padding: 0 1rem;
}
#tag h3{
    font-size: 1.3rem;
    padding: 1rem 2rem;
    border-bottom: 1px dashed #DDD;
}
#tag div {
    float: left;
    padding: 0.5rem 2rem;
    border: 1px #32D3C3 solid;
    border-radius: 5px;
    margin: 0.5rem 0.2rem;
    color: #32D3C3;
}
@media screen and (max-width: 768px){
    #tag h3{
        font-size: 1.3rem;
        padding: 1rem 2rem;
        border-bottom: 1px dashed #DDD;
    }
}
@media screen and (min-width: 768px){
    #tag h3{
        font-size: 1.3rem;
        padding: 1rem 2rem;
        border-bottom: 1px dashed #DDD;
        margin-bottom: 0.5rem;
    }
}
</style>