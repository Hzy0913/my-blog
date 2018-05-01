<template>
    <div id="articlesDetails" :class="{'fadein': fadein}">
        <div v-for="item in list" :key="item._id">
            <div class="detail-header">
                <h1>{{item.title}}</h1>
                <div class="time">
                    {{new Date(item.date).format('yyyy-MM-dd')}}
                </div>
                <div class="detail-body-tag">
                    <span v-for="list in item.label" :key="list" class="tag">{{list}}</span>
                </div>
            </div>
            <div class="detail-body" v-compiledMarkdown>{{item.articleContent}}</div>
            <div class="detail-footer">
                <Comment :comment="item.comment" :authUrl="authUrl" />
            </div>
        </div>
    </div>
</template>

<script>
import {Loading} from 'element-ui';
import {dateFormat} from '../../utils/index';
import marked from 'marked';
import axios from 'axios';
import highlight from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('css', css);
highlight.registerLanguage('php', php);
highlight.registerLanguage('python', python);
highlight.registerLanguage('sql', sql);
highlight.registerLanguage('bash', bash);

import Comment from '../../components/Comment'
import '../../assets/hybrid.css'
dateFormat()
export default {
    name: 'Articledetails',
    head () {
      return {
        title: this.title || 'binlive',
        meta: [
          { hid: this.title, name: this.title, content: '前端开发,前端,web前端开发,node,vue,react,webpack,git' }
        ]
      }
    },
    data () {
        return {
            list: [],
            fadein:false,
            authUrl: '',
            title: ''
        }
    },
    mounted () {
      this.fetchData();
    },
    components: {
      Comment
    },
    methods: {
        fetchData (){
            let loadingInstance = Loading.service({ fullscreen: true ,text:'努力加载中'});
            let id = this.$route.params.id;
            this.authUrl = `https://github.com/login/oauth/authorize?client_id=ee9b0ae4553f4fb449bf&state=${id}&redirect_uri=http://www.binlive.cn:3080/api/oauth`;
            axios.get('/api/articleDetails/'+ id).then(
                res => {
                this.fadein=true;
                const articleDetails = res.data.articleDetails;
                this.title = articleDetails.title;
                this.list.push(articleDetails);
                    loadingInstance.close();
                },
                res => {console.log('错误'+res);
                    loadingInstance.close();
                }
            );
        }
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
                    aList[i].style.color = '#008679'
                    aList[i].style.textDecoration = 'none'
                    aList[i].setAttribute('target', '_blank')
                }
                for (let i=0; i<pList.length; i++){
                    pList[i].style.color = '#24292e'
                }
                for (let i=0; i<strongList.length; i++){
                    strongList[i].style.color = '#007b6f'
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
        }
    }
}
</script>

<style scoped>
.fadein{-moz-transition: all 0.6s ease-in-out;-o-transition: all 0.6s ease-in-out; -webkit-transition: all 0.6s ease-in-out; transition: all 0.6s ease-in-out;opacity:1 !important; -webkit-transform:translate3d(0, 0, 0) !important;transform:translate3d(0, 0, 0) !important;}
.detail-body pre{background-color:#282a36 !important}
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
.detail-body{ text-align: left; border-bottom: 1px solid #f0f0f0; color: #666; padding:22px;padding-bottom:10px;min-height:500px;padding-top:40px;}
</style>
