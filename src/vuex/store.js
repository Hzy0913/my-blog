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
    'search': ''
};
// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
    search (state,search) {
        // 变更状态
        console.log(search)
        state.search=search
    }
};

//export default new Vuex.Store({
//    state,
//    mutations
//})
export default new Vuex.Store({
    state,
    mutations,

});