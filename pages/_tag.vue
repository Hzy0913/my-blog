<template>
  <div id="tag" class="container">
    <div class="tagtitle">
      <p :class="{fadetitle: fadetitle}">{{tagtitle}}</p>
    </div>
    <ArticleList :articleList="tagList"/>
    <div class="notfound" :class="{'shownotfound':notfound}">
      <img src="http://img.binlive.cn/upload/1525014468729"
           alt="binlive个人技术博客vue、react、node">
    </div>
    <div class="scrollbottomtip" >
      <p :class="{scrolltip: scrolltip}" style="position:relative;top:-15px;height:24px"></p>
      <div :class="{scrollload:scrollload, scrollloadlast:scrollloadlast}">
        <p>数据加载中</p>
        <i class="el-icon-loading"></i>
      </div>
    </div>
    <p :class="{'hide':lastpage}" class="lastpagetip">没有更多数据了...</p>
  </div>
</template>

<script>
  import axios from '~/plugins/axios'
  import ArticleList from '../components/ArticleList';

  export default {
    name: 'tag',
    head () {
      return {
        title: this.tagtitle,
        meta: [
          { hid: 'description', name: 'description', content: `${this.tagtitle},前端开发,前端,web前端开发,node,vue,react,webpack,git` },
          { name: 'keywords', content: this.tagtitle }
        ]
      }
    },
    data() {
      return {
        page: 0,
        lastpage: true,
        ScrollFirst: true,
        scrolltip: false,
        scrollload: true,
        scrollloadlast: false,
      };
    },
    async asyncData ({params}) {
      try {
        const {tag} = params;
        const {data: {Article}} = await axios.get(`/api/getArticleLabel/${tag}/0`);
        return {
          tagList: Article,
          tagtitle: tag,
          fadetitle: true,
          notfound: !Article.length
        };
      } catch (err) {
        error({statusCode: 404})
      }
    },
    components: {
      ArticleList
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      if (window.loading) {
        window.loading.close();
      }
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
  .shownotfound {
    display: block !important
  }
  .notfound {
    width: 100%;
    padding-top: 40px;
    display: none
  }
  .notfound img {
    width: 60%;
    margin: 0 auto;
    display: block
  }
</style>
