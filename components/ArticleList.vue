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
            <div class="avatar" v-for="list in item.user" :key="list.id">
              <a :href=list.html_url target="_blank">
                <img src="http://img.binlive.cn/upload/1507976661815" alt="">
              </a>
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
    methods: {
      articlesDetailsFn: function(id){
        this.$router.push({ path: `/details/${id}`});
      }
    }
  }
</script>
