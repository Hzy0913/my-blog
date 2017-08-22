<template>
    <div>
        <div id="container" v-comment:id="ArticlesId"></div>
    </div>
</template>

<script>
import Gitment from '../assets/gitment/gitment.js'
import '../assets/gitment/default.css'
export default {
    props: ['ArticlesId'],
    data () {
        return {

        }
    },
    mounted () {

    },
    directives: {
        comment: {
            bind: function(el, binding){
                const myTheme = {
                    render(state, instance) {
                        const container = document.createElement('div')
                        container.lang = "en-US"
                        container.className = 'gitment-container gitment-root-container'
                        // container.appendChild(instance.renderHeader(state, instance))
                        container.appendChild(instance.renderEditor(state, instance))
                        container.appendChild(instance.renderComments(state, instance))
                        // container.appendChild(instance.renderFooter(state, instance))
                        return container
                    },
                }
                var gitment = new Gitment({
//                    id: 'www.binlive.cn',
                    owner: 'Hzy0913',
                    repo: 'bolgrepo',
                    oauth: {
                        client_id: 'ee9b0ae4553f4fb449bf',
                        client_secret: '98165fd8621b8bbf58b5934e7f9e6fb67995c54b',
                    },
                    theme: myTheme
                })
                gitment.render(el)

            }
        }
    }
}
</script>

<style scoped>
</style>