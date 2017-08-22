<template>
    <div id="about">
        <h3>关于我</h3>
        <ul class="about-wrap">

        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {

    },
    methods: {
        nextpage(){
            alert("1")
            console.log("请求分页1")

        }
    }
}
</script>

<style scoped>
#about {
    height: 100vh;
    text-align: center;
}
#about > h3{
    font-size: 1.3rem;
    padding: 1rem 2rem;
    border-bottom: 1px dashed #DDD;
}
#about > ul{
    text-align: left;
    line-height: 1.5rem;
    padding: 1rem 1.5rem;
    /*list-style-type: disc;*/
    font-size: 0.7rem;
}
@media screen and (min-width: 768px){
    #about {
        height: 100vh;
        text-align: center;
    }
    #about > h3{
        font-size: 1.3rem;
        padding: 1rem 2rem;
        border-bottom: 1px dashed #DDD;
    }
    #about .about-wrap li{
        list-style-type: none;
        text-align: left;
        line-height: 0.6rem;
        padding: 0.6rem 1.5rem;
        font-size: 1rem;
    }
}
</style>