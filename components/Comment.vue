<template>
  <div class="comment">
    <div class="comment-content">
      <div :class="{'fadeOutRight': deleteId === item.created}" class="comment-item fadeInRight" v-for="item in comments" :key="item.created">
        <div class="comment-avatar avatar">
          <img :src=item.avatar_url>
        </div>
        <a :href=item.html_url target="_blank"><h1>{{item.name}}</h1></a>
        <span>{{new Date(item.created).format('yyyy-MM-dd hh:mm')}}</span>
        <div class="comment-item-con">
          <p>{{item.comment}}</p>
          <div class="children-comment-wrapper">
            <el-input
              type="textarea"
              :rows="1"
              placeholder="请输入内容"
              v-model="subtextarea"
              class="children-comment"
              v-show="showtextarea === item.created"
            />
            <i v-show="showtextarea !== item.created" @click="showSubComment(item.created)">回复</i>
            <i class="removecomment" v-if="superAdmin" v-show="showtextarea !== item.created" @click="deleteComment(item.created)">删除</i>
            <el-button type="primary" size="mini" v-show="showtextarea === item.created"
                       @click="handleSubComment(item.created)" :loading="subcommenting"
                       class="ok-style">确定
            </el-button>
          </div>
        </div>
        <div :class="{'fadeOutRight': deleteId === li.created}" class="comment-item-sub fadeInRight"  v-for="li in item.subcomment" :key="li.created">
          <div class="comment-avatar avatar">
            <img :src=li.avatar_url>
          </div>
          <a :href=li.html_url target="_blank"><h1>{{li.name}}</h1></a>
          <span>{{new Date(li.created).format('yyyy-MM-dd hh:mm')}}</span>
          <div>
            <p>{{li.comment}}</p>
          </div>
          <i class="removecomment" v-if="superAdmin" @click="deleteSubComment(item.created, li.created)">删除</i>
        </div>
      </div>
    </div>
    <div style="padding: 0px 15px" class="comment-text">
      <div class="avatar">
        <a :href=userauth target="_blank">
          <img :src=avatar>
        </a>
      </div>
      <div class="textarea">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入评论内容"
          maxlength=1050
          v-model="textarea">
        </el-input>
        <el-button type="primary" size="medium" class="comment-button" @click="handlecomment"
                   :loading="commenting">评论
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {Notification} from 'element-ui';
  import {dateFormat} from '../utils/index';
  dateFormat();

  export default {
    name: 'Comment',
    data() {
      return {
        textarea: '',
        subtextarea: '',
        showtextarea: '',
        user: '',
        commenting: false,
        deleteId: '',
        subcommenting: false,
        superAdmin: false,
        comments: []
      };
    },
    props: {
      authUrl: String,
      comment: Array
    },
    computed: {
      userauth() {
        return this.user ? this.user.html_url : this.authUrl;
      },
      avatar() {
        return this.user ? this.user.avatar_url : 'http://img.binlive.cn/upload/1525002348985';
      },
    },
    created() {
      this.comments = this.comment;
    },
    mounted() {
      const user = JSON.parse(localStorage.getItem('lid'));
      const {id} = this.$route.query;
      this.superAdmin = user ? !!user.token : false;
      this.user = user;
      if (localStorage.getItem('lid') || !id) return;
      axios.get(`/api/authorized/${id}`)
        .then(res => {
          const {avatar_url, html_url, name, id, token} = res.data.user;
          const obj = {avatar_url, html_url, name, id, token};
          this.user = obj;
          this.superAdmin = !!token;
          localStorage.setItem('lid', JSON.stringify(obj));
        });
    },
    methods: {
      handlecomment() {
        if (!this.user) {
          return window.location.href = this.authUrl;
        }
        if (!this.textarea.trim()) {
          return Notification({
            title: '提示',
            dangerouslyUseHTMLString: true,
            offset: 100,
            message: '<i class="el-icon-info" style="color: #4cbcfe;margin-right: 6px"></i><strong>您还未输入评论内容</strong>'
          });
        }
        this.commenting = true;
        const id = this.$route.params.id;
        const user = JSON.parse(localStorage.getItem('lid'));
        user.created = new Date().getTime();
        user.comment = this.textarea;
        user.subcomment = [];
        axios.post(`/api/comment/${id}`, {user})
          .then(
            res => {
              this.comment.push(user);
              this.textarea = '';
              this.commenting = false;
            });
      },
      deleteComment(created) {
        const id = this.$route.params.id;
        axios({
          method: 'post',
          url: `/api/deletecomment/${id}`,
          data: {
            created
          },
          headers: {token: this.user.token}
        });
        this.deleteId = created;
        setTimeout(() => this.comments = this.comments.filter(item => item.created !== created), 500);
      },
      deleteSubComment(created, subcreated) {
        const id = this.$route.params.id;
        axios({
          method: 'post',
          url: `/api/deleteSubcomment/${id}`,
          data: {
            created,
            subcreated
          },
          headers: {token: this.user.token}
        });
        const createdIndex = this.comments.findIndex(item => item.created === created);
        const updateComment = (this.comments[createdIndex] || {}).subcomment.filter(item => item.created !== subcreated);
        this.deleteId = subcreated;
        setTimeout(() => this.comments[createdIndex].subcomment = updateComment, 500);
      },
      showSubComment(created) {
        this.showtextarea = created;
      },
      handleSubComment(created) {
        if (!this.user) {
          return window.location.href = this.authUrl;
        }
        if (!this.subtextarea.trim()) {
          return Notification({
            title: '提示',
            dangerouslyUseHTMLString: true,
            offset: 100,
            message: '<i class="el-icon-info" style="color: #4cbcfe;margin-right: 6px"></i><strong>您还未输入评论内容</strong>'
          });
        }
        this.subcommenting = true;
        const textarea = this.textarea;
        const id = this.$route.params.id;
        const user = JSON.parse(localStorage.getItem('lid'));
        user.created = new Date().getTime();
        user.subcomment = [];
        user.comment = this.subtextarea;
        axios.post(`/api/subComment/${id}/${created}`, {user})
          .then(
            res => {
              const index = this.comment.findIndex(item => item.created === created);
              this.comment[index].subcomment.push(user);
              this.subcommenting = false;
              this.subtextarea = '';
              this.showtextarea = '';
            });
      },
      articlesDetailsFn: function (id) {
        this.$router.push({path: `/details/${id}`});
      }
    }
  };
</script>
<style scoped>
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    float: left
  }

  .avatar img {
    width: 100%
  }

  .textarea {
    padding-left: 50px;
    padding-bottom: 50px;
    margin-top: 20px
  }

  .comment-button {
    padding: 6px 12px;
    font-size: 15px;
    letter-spacing: 2px;
    float: right;
    margin-top: 10px;
  }

  .comment-item {
    overflow: hidden;
    margin-bottom: 10px;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  }

  .comment-item .avatar {
    margin-right: 14px
  }

  .comment-item .avatar img {
    float: left;
    width: 100%
  }

  .comment-item h1 {
    float: left;
    color: #009a61;
    font-size: 14px;
    line-height: 18px;
    margin-right: 10px
  }

  .comment-item span {
    float: left;
    color: #666;
    font-size: 13px;
    line-height: 18px
  }

  .comment-item-con {
    padding-top: 46px;
    padding-left: 50px;
    padding-right: 30px;
    margin-bottom: 30px
  }

  .comment-item-con p {
    color: #333;
    font-size: 14px;
    text-align: left
  }

  .comment-item-con i {
    font-style: normal;
    color: #287156;
    font-size: 14px;
  }

  .children-comment {
    padding-right: 60px;
    margin-top: 14px
  }

  .children-comment-wrapper {
    position: relative;
    top: -10px
  }

  .children-comment-wrapper i {
    position: absolute;
    top: 10px;
    right: 4px;
    display: inline-block;
    cursor: pointer
  }
  .removecomment {
    position: absolute;
    top: 10px;
    right: 4px;
    display: inline-block;
    cursor: pointer;
    right: 48px !important;
    font-style: normal;
    color: #287156;
    font-size: 14px;
  }
  .comment-item-sub .removecomment {
    right: 15px !important;
  }
  .comment-item-sub {
    overflow: hidden;
    margin-top: 4px;
    padding: 10px 20px 10px 20px;
    background-color: #fafafa;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 50px;
    position: relative;
  }

  .comment-item-sub p {
    padding-top: 30px;
    padding-left: 40px;
    text-align: left;
    word-wrap: break-word;
    word-break: normal;
    font-size: 13px;
    color: #666
  }

  .comment-item-sub .avatar {
    width: 30px;
    height: 30px
  }

  .ok-style {
    padding: 8px;
    position: absolute;
    right: 0px;
    top: 16px
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translate3d(10%, 0, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .fadeInRight {
    animation-name: fadeInRight;
    animation-duration: 0.5s;
    animation-fill-mode: both;
  }

  @keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: translate3d(10%, 0, 0);
    }
  }

  .fadeOutRight {
    animation-name: fadeInRight;
    animation-duration: 0.5s;
    animation-name: fadeOutRight;
  }
</style>
