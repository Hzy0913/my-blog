/**
 * Created by king on 2017/7/15.
 */
import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);

//
//const store = new Vuex.Store({
//    state: {
//        count: 0
//    },
//    mutations: {
//        increment (state) {
//            state.count++
//        }
//    }
//})
const state = {
    'headerTitle': '福利',
    'menus': 'uz.NAME_TITILE',
    'menuShow': false,
    'loadingShow': false,
    'scrollTop':230,
    'search': '',
    'searchRefresh': false,
    'newlistfirst':true,
    'newlistcon':[],
    'taglistfirst':true,
    'taglistcon':[]
};
// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
    search (state,search) {
        // 变更状态
        console.log(search)
        state.search=search
    },
    searchRefresh (state,searchRefresh) {
        // 变更状态刷新后search 布尔
        state.searchRefresh=searchRefresh
    },
    // 变更最新列表页状态
    updatenewlistcon (state,newlistcon) {
        console.log(newlistcon)
        state.newlistcon=newlistcon
    },
    newlistfirst (state,newlistfirst) {
        console.log(newlistfirst)
        state.newlistfirst=newlistfirst
    },
    // 变更tag标签表页状态
    updatetaglistcon (state,taglistcon) {
        console.log(taglistcon)
        state.taglistcon=taglistcon
    },
    taglistfirst (state,taglistfirst) {
        state.taglistfirst=taglistfirst
    },
};

//export default new Vuex.Store({
//    state,
//    mutations
//})
export default new Vuex.Store({
    state,
    mutations,

});