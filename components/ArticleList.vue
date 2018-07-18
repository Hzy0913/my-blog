<template>
  <div class="articleList">
    <el-row :gutter="20" style="padding-bottom:12px">
      <el-col :xs="24" :sm="24" :md="24" :lg="12"  v-for="item in articleList" :key="item._id" class="artitem" >
        <div @click="articlesDetailsFn(item._id)">
          <div class="box-card articles-box" >
            <div class="post-time">
              <span class="post-timecon">{{new Date(item.date).format('yyyy-MM-dd')}}</span>
            </div>
            <div class="post-title" >
              <h1>{{item.title}}</h1>
            </div>
            <div class="post-abstract">
              {{item.introduce}}
            </div>
          </div>
          <div class="artitem_bottom">
            <div class="poster" v-for="list in item.user" :key="list.id">
              <img :src=posters[item.label[0]]||defaultPoster alt="">
            </div>
            <div class="post-label-box">
              <span class="post-label" v-for="list in item.label" :key="list.id">{{list}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {Loading} from 'element-ui';
  import {dateFormat} from '../utils/index';
  dateFormat();
  export default {
    name: 'ArticleList',
    props: {
      articleList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        defaultPoster: 'http://img.binlive.cn/upload/1508147650899',
        posters: {
          javascript: 'http://img.binlive.cn/upload/1508147650899',
          node: 'http://img.binlive.cn/upload/1508147665291',
          css: 'http://img.binlive.cn/upload/1508147554750',
          html5: 'http://img.binlive.cn/upload/1508147586798',
          jquery: 'http://img.binlive.cn/upload/1508147631388',
          vue: 'http://img.binlive.cn/upload/1508147700511',
          git: 'http://img.binlive.cn/upload/1508147609623',
          react: 'http://img.binlive.cn/upload/1525527435206react.png'
        }
      }
    },
    computed: {
      // 一个计算属性的 getter
      poster() {
        return this.a + 1
      }
    },
    methods: {
      articlesDetailsFn: function(id){
        this.$router.push({ path: `/details/${id}`});
      }
    }
  }
</script>

<style>
  .poster {
    float: left;
    width: 30px;
    height: 30px;
    margin-top: 1px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 3px 2px 4px rgba(36, 61, 107, .2);
  }
  .poster img {
    width: 100%;
    position: relative;
    top: -12%;
  }
</style>
