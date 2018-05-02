<template>
  <div>
    <div class="grid-content bg-purple container">
      <div class="tagtitle">
        <p :class="{'fadetitle':fadetitle}">最新</p>
      </div>
      <ArticleList :articleList="articleList"/>
      <div class="scrollbottomtip">
        <p :class="{ scrolltip: scrolltip }" style="position:relative;top:-15px;height:24px;"></p>
        <div :class="{scrollload:scrollload,scrollloadlast:scrollloadlast}">
          <p>数据加载中</p>
          <i class="el-icon-loading"></i>
        </div>
      </div>
      <p :class="{'hide':lastpage}" class="lastpagetip">我也是有底线的...</p>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import {Loading} from 'element-ui';
  import ArticleList from '../components/ArticleList';

  export default {
    name: 'latestArticles',
    data() {
      return {
        articleList: [],
        page: 0,
        lastpage: true,
        first: true,
        ScrollFirst: true,
        scrolltip: true,
        scrollload: true,
        scrollloadlast: false,
        scrollpage: true,
        fadetitle: false,
        tagtitle: ''
      };
    },
    components: {
      ArticleList
    },
    mounted() {
      document.title = 'binlive-最新';
      const {newArticlelist} = this.$store.state;
      if (this.scrollpage) {
        window.addEventListener('scroll', this.handleScroll);
      }
      if (newArticlelist.length) {
        this.fadetitle = true;
        this.articleList = newArticlelist;
        return;
      }
      const loadingInstance = Loading.service({fullscreen: true});
      axios.get('/api/articleList/0')
        .then(res => {
          if (res.data.length < 20) {
            this.scrolltip = true;
          }
          this.articleList = res.data.Articles;
          loadingInstance.close();
          this.fadetitle = true;
          this.$store.commit('updatenewlistcon', this.articleList);
          this.first = false;
        });
    },
    methods: {
      nextpage() {
        if (this.lastpage) {
          const {newArticlelist} = this.$store.state;
          if (newArticlelist.length) {
            this.page = Math.ceil(newArticlelist.length / 10);
          } else {
            this.page++;
          }
          axios.get(`/api/articleList/${this.page}`)
            .then(res => {
              const Articles = res.data.Articles;
              this.articleList = [...this.articleList, ...Articles];
              this.ScrollFirst = true;
              this.scrolltip = false;
              this.scrollload = true;
              if (Articles.length < 10) {
                this.lastpage = false;
                this.scrollloadlast = true;
              }
              this.$store.commit('updatenewlistcon', this.articleList);
            });
        }
      },
      handleScroll() {
        const jrscrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollT;
        let scrollBottom = document.body.clientHeight - window.innerHeight - jrscrollTop;
        if (scrollBottom < 30 && this.scrollpage) {
          if (this.ScrollFirst) {
            this.scrolltip = true;
            this.scrollload = false;
            this.ScrollFirst = false;
            this.nextpage();
          }
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll, false);
    }
  };
</script>

<style scoped>
  .lastpagetip {
    font-size: 14px
  }
</style>
