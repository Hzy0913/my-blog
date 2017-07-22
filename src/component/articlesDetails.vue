<template>
    <div id="articlesDetails" :class="{'fadein': fadein}">
        <div v-for="item in list">
            <div class="detail-header">
                <h1>{{item.title}}</h1>
                <div class="time">
                    {{new Date(item.date).format('yyyy-MM-dd')}}
                </div>
                <div class="detail-body-tag">
                    <span v-for="list in item.label" class="tag">{{list}}</span>
                </div>
            </div>
            <div class="detail-body" v-compiledMarkdown>{{item.articleContent}}</div>
            <!--<div id="cloud-tie-wrapper" class="cloud-tie-wrapper" v-comment:id="item._id"></div>-->
            <div class="detail-footer" v-comment>
                <Comment :ArticlesId="item._id"></Comment>
                <!--<div id="container" v-comment:id="item._id"></div>-->
            </div>
        </div>
    </div>
</template>

<script>
import { Loading } from 'element-ui';
import marked from 'marked';
import highlight from 'highlight.js'
import '../assets/hybrid.css'
import Comment from './comment.vue'
import {dateFormat} from '../utils/utils.js'
export default {
    name: 'details',
    data () {
        return {
            list: [],
            fadein:false,
        }
    },
    created :function(){
        console.log("1111")
    },
    mounted () {
        dateFormat()
        this.fetchData()
    },
    methods: {
        fetchData (){
            console.log("这里啊111")
            let loadingInstance1 = Loading.service({ fullscreen: true });
            let id = this.$route.params.id
            this.$http.get('/api/articleDetails/'+ id).then(
                res => {
                loadingInstance1.close();
                this.fadein=true;
                this.list = []
                console.log(res.body)

                this.list.push(res.body);

        },
                res => {console.log('错误'+res);
                loadingInstance1.close();
                }
            )
        }
    },
    watch:{
//        "$route": "fetchData"
    },
    components: {
        Comment
    },
    directives: {
        compiledMarkdown: {
            bind: function(el){
                marked.setOptions({
                    renderer: new marked.Renderer(),
                    gfm: true,
                    tables: true,
                    breaks: false,
                    pedantic: false,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false,
                    highlight: function (code) {
                        return highlight.highlightAuto(code).value;
                    }
                })
                el.innerHTML = marked(el.innerText);
                var preList = el.querySelectorAll('pre');
                var imgList = el.querySelectorAll('img');
                var strongList = el.querySelectorAll('strong');
                var pList = el.querySelectorAll('p');
                var aList = el.querySelectorAll('a');
                for (let i=0; i<aList.length; i++){
                    aList[i].style.color = '#32D3C3'
                    aList[i].style.textDecoration = 'none'
                    aList[i].setAttribute('target', '_blank')
                }
                for (let i=0; i<pList.length; i++){
                    pList[i].style.color = '#3E495E'
                }
                for (let i=0; i<strongList.length; i++){
                    strongList[i].style.color = '#32D3C3'
                }
                for(let i=0; i<imgList.length; i++){
                    imgList[i].style.width = 100 + '%';
                }
                for(let i=0; i<preList.length; i++){
                    preList[i].style.overflowX = 'scroll';
                    preList[i].style.backgroundColor = '#e8e8e8'
                    preList[i].style.padding = 0.5 + 'rem'
                }
            }
        },
        comment: {
            update: function(el, binding){
                // 自定义Gitment
//                console.log(el.querySelector('.gitment-comments-empty'))

            }
        }
    }
}
</script>

<style scoped>
.fadein{-moz-transition: all 0.6s ease-in-out;-o-transition: all 0.6s ease-in-out; -webkit-transition: all 0.6s ease-in-out; transition: all 0.6s ease-in-out;opacity:1 !important; -webkit-transform:translate3d(0, 0, 0) !important;transform:translate3d(0, 0, 0) !important;}
.code{color:#fff}
.detail-body pre{background-color:#282a36 !important}

@meida screen and (max-width: 768px){
    #articlesDetails > div{
        width: 90%;
    }
}
#articlesDetails { height: 100vh; overflow: scroll;
    text-align: center;
    padding: 0 1rem;
    background-color: #fff;
    -webkit-font-smoothing: antialiased;
    opacity:0; -webkit-transform:translate3d(0, 10px, 0);transform:translate3d(0, 10px, 0);
}
.detail-header {
    width:140%;margin-left:-20%; background-color:#004c99;min-height:200px;padding-left:20%;
}
.detail-header>h1{ font-size:24px; color:#fff;font-weight:900;padding-top:100px;text-align:left;padding-left:20px;}
.detail-header .time { font-size:14px;color:#f2f2f2; margin-top:10px;margin-bottom:4px; text-align:left;padding-left:22px; }
.detail-body-tag{padding-left:22px;}
.detail-body-tag span{float:left;border-radius:2px; padding:4px 8px;background-color:#fff;margin-right:10px; box-shadow:1px 1px 0px rgba(2,58,114,.8)}
.detail-body-tag span:nth-child(1n){background-color:#007fff;color:#fff}

.detail-body{ text-align: left; border-bottom: 1px solid #f0f0f0;margin-bottom:60px; color: #666; padding:22px;padding-bottom:40px;min-height:500px;padding-top:40px;}
</style>