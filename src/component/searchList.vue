<template>
    <div id="tag">
        <h3>搜索</h3>
        <div v-for="item in searchList">
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
    name: 'searchList',
    data () {
        return {
            searchList: [],
            search:'',
            firstcom:true
        }
    },
    created :function(){
        this.searchList= []
        this.search=this.$store.state.search
        console.log('执行搜索事件');
        console.log(this.search);
        if(this.search==""){
            alert("展示提示输入搜索");
            return;
        }
        //        执行搜索事件
        this.$http.get('/api/getArticleList/'+this.search).then(
                respone => {this.searchList=respone.body;console.log( this.searchList)},
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
                if(this.firstcom){
                    this.firstcom=false;
                }else {
                    this.searchList=[];
                    //        执行搜索事件
                    this.$http.get('/api/getArticleList/'+this.search).then(
                            respone => {this.searchList=respone.body;console.log( this.searchList)},
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