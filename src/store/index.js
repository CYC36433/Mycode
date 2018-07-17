import Vue from 'vuelib'
import Vuex from 'vuexlib'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        appheight: 0
    },
    mutations: {
        RE_APP_HEIGHT: function(_state, height) {
            _state.appheight = height;
        }
    },
    actions: {
        reAppHeight: function(context, height) {
            context.commit('RE_APP_HEIGHT', height);
        }
    },
    getters: {
        appheight: function(state) {
            return state.appheight;
        }
    }
})