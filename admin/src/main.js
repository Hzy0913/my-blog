import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import articleList from './component/ArticleList.vue'
import articleEdit from './component/ArticleEdit.vue'
import AtricleLabel from './component/ArticleLabel.vue'
//import personalCenter from './component/PersonalCenter.vue'
import articlePreview from './component/ArticlePreview.vue'
import ExamineList from './component/examineList.vue'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
    mode: 'history',
	routes: [
        {path: '/admin', component: articleList,redirect: '/admin/articleEdit',
            children: [
                {path: 'articleEdit', component: articleEdit},
                {path: 'articlePreview:id', component: articlePreview},
            ]
        },
		{path: '/atricleLabel', component: AtricleLabel},
        {path: '/examineList', component: ExamineList},
        //{path: '/personalCenter', component: personalCenter},
        {path: '*', component: articleList,redirect: '/admin/articleEdit'}
	]
})


new Vue({
  	el: '#app',
  	router: router,
  	render: h => h(App)
})
