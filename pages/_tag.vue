<template>
  <div id="tag" class="container">
    <div class="tagtitle">
      <p :class="{'fadetitle':fadetitle}">{{tagtitle}}</p>
    </div>
    <ArticleList :articleList="tagList"/>
    <div class="scrollbottomtip" :class="{'scrollbottomtipno':scrollbottomtipno}">
      <p :class="{ scrolltip: scrolltip }" style="position:relative;top:-15px;height:24px"></p>
      <div :class="{scrollload:scrollload,scrollloadlast:scrollloadlast}">
        <p>数据加载中</p>
        <i class="el-icon-loading"></i>
      </div>
    </div>
    <p :class="{'hide':lastpage}" class="lastpagetip">没有更多数据了...</p>
  </div>
</template>

<script>
  import {Loading} from 'element-ui';
  import axios from 'axios';
  import ArticleList from '../components/ArticleList';

  export default {
    name: 'tag',
    head () {
      return {
        title: this.tagtitle,
        meta: [
          { hid: this.tagtitle, name: this.tagtitle, content: '前端开发,前端,web前端开发,node,vue,react,webpack,git' }
        ]
      }
    },
    data() {
      return {
        tagList: [],
        tagtitle: '',
        page: 0,
        lastpage: true,
        first: true,
        scrollTop: 0,
        ScrollFirst: true,
        scrolltip: false,
        scrollload: true,
        scrollloadlast: false,
        fadetitle: false,
        scrollbottomtipno: false,
      };
    },
    components: {
      ArticleList
    },
    mounted() {
      this.tagList = this.$store.state.taglistcon;
      const {tag} = this.$route.params;
      let loadingInstance = Loading.service({fullscreen: true});
      axios.get(`/api/getArticleLabel/${tag}/0`)
        .then(res => {
          if (res.data.length < 10) {
            this.scrollbottomtipno = true;
          }
          this.tagList = res.data.Article;
          this.tagtitle = tag;
          this.fadetitle = true;
          loadingInstance.close();
          this.$store.commit('updatetaglistcon', this.tagList);
        });
      this.fadetitle = true;
      this.first = false;
      window.addEventListener('scroll', this.handleScroll);
      this.tagtitle = this.$store.state.tagtitle;
      this.fadetitle = true;
    },
    methods: {
      nextpage() {
        const tag = this.$route.params.tag;
        if (this.lastpage) {
          this.page++;
          const page = this.page;
          axios.get(`/api/getArticleLabel/${tag}/${page}`)
            .then(res => {
              this.tagList = [...this.tagList, ...res.data.Article];
              this.ScrollFirst = true;
              this.scrolltip = false;
              this.scrollload = true;
              if (res.data.Article.length < 10) {
                this.lastpage = false;
                this.scrolltip = true;
                this.scrollloadlast = true;
              }
              this.$store.commit('updatetaglistcon', this.tagList);
              this.articleList = this.$store.state.newlistcon;
            })
            .catch(err => this.ScrollFirst = true);
        }
      },
      handleScroll() {
        let jrscrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollT;
        let scrollBottom = document.body.clientHeight - window.innerHeight - jrscrollTop;
        if (scrollBottom < 10) {
          if (this.ScrollFirst) {
            this.scrolltip = true;
            this.scrollload = false;
            this.ScrollFirst = false;
            this.nextpage();
          }
        }
      }
    }
  };

</script>

<style scoped>
  .lastpagetip {
    font-size: 14px
  }
</style>
