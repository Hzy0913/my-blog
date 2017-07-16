<template>
    <div>
        <div class="left-sidebar">
            <div class="admin-logo">
                <img src="./assets/logo.png" width="40" height="40">
            </div>
            <div class="article-logo" @click="articleList">
                <img src="./assets/article.png" height="50" width="50">
            </div>
            <div class="label-logo" @click="articleLabel">
                <img src="./assets/adminlabel.png" height="50" width="50">
            </div>
            <div class="use-logo" @click="personalCenter">
                <img src="./assets/use.png" height="50" width="50">
            </div>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return{

        }
    }
}
</script>

<style>

</style>