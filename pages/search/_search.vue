<template>
  <div>
    <div id="searchPage" class="container">
      <div class="tagtitle">
        <p :class="{'fadetitle':fadetitle}">搜索有关于<span style="margin-left:10px;">"{{search}}"</span>
        </p>
      </div>
      <div class="notfound" :class="{'shownotfound':notfound}">
        <img src="http://img.binlive.cn/upload/1525014468729"
             alt="binlive个人技术博客vue、react、node">
      </div>
      <ArticleList :articleList="searchList"/>
    </div>
  </div>
</template>

<script>
  import {Loading} from 'element-ui';
  import axios from 'axios';
  import ArticleList from '../../components/ArticleList';
  import {dateFormat} from '../../utils/index';

  dateFormat();
  export default {
    name: 'searchList',
    head () {
      return {
        title: `搜索${this.search}` || 'binlive',
        meta: [
          { hid: `搜索${this.search}`, name: `搜索${this.search}`, content: '前端开发,前端,web前端开发,node,vue,react,webpack,git' }
        ]
      }
    },
    data() {
      return {
        searchList: [],
        search: '',
        firstcom: true,
        notfound: false,
        searchnull: false
      };
    },
    components: {
      ArticleList
    },
    created() {
      const {search} = this.$route.params;
      this.search = search;
      this.fadetitle = true;
      const loadingInstance = Loading.service();
      axios.get(`/api/ArticleSearch/${search}`)
        .then(respone => {
          this.searchList = respone.data.Article;
          loadingInstance.close();
          if (this.searchList.length) {
            this.notfound = false;
          } else {
            this.notfound = true;
          }
        });
    }
  };
</script>

<style scoped>
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
