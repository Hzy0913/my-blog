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
    </div>
</template>

<script>
import { Loading } from 'element-ui';

export default {
    data () {
        return {
            tagList: [],
        }
    },
    mounted () {
                let loadingInstance=Loading.service();
                let tag = this.$route.params.tag
                this.$http.get('/api/getArticleLabel/'+tag).then(
                        res => {
                    this.tagList = res.body;
                loadingInstance.close();
            },
                res => {

                }
            )
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
            console.log(res)
        },
            res => {

            }
        )
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