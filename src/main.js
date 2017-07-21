import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import LatestArticles from './component/latestArticles.vue'
import Archiver from './component/archives.vue'
import Search from './component/searchList.vue'
import Tag from './component/tag.vue'
import About from './component/about.vue'
import ArticlesDetails from './component/articlesDetails.vue'
import NotFound from './component/notFound.vue'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResource);

const scrollBehavior = (to, from, savedPosition) => {
    return { x: 0, y: 1 }
};
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: LatestArticles, mate: { keepAlive: true }},
        {path: '/search', component: Search},
        {path: '/about', component: About},
        {path: '/:tag',name: 'tag', component: Tag},
        {path: '/details/:id', name: 'details', component: ArticlesDetails},
        {path: '*', component: NotFound}
    ],
    scrollBehavior,
    saveScrollPosition:true
})

new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App),
    data: {
        eventbus: new Vue()
    }
})

//Vue.filter('reverse', function (value) {
//   console.log("这里这里")
//   console.log(typeof(value))
//    //var value = value.reverse()
//    //return value
//})
