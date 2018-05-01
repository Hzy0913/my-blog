<template>
  <div class="container">
    <div v-if="error.statusCode === 404" class="page">
      <nuxt-link to="/">
        <img src="http://img.binlive.cn/upload/1525013647902" alt="binlive个人技术博客vue、react、node">
      </nuxt-link>
    </div>
    <div v-else class="page">
      <nuxt-link to="/">
        <img src="http://img.binlive.cn/upload/1525016935287" alt="binlive个人技术博客vue、react、node">
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'blog'
  }
</script>

<style scoped>
  .page img{width: 80%;padding-top: 60px; display: block; margin:0 auto}
</style>
