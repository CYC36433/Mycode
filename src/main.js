import Vue from 'vuelib'
import VueCookies from 'vue-cookies'
import Router from 'vuerouterlib'
import store from '@/store'
import request from './util/request'
import comLogin from './layout/login/login'
const developingRouter = require('../static/developingmenu.json')

Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.use(Router)

var routerData = [{
    path: '/login',
    name: 'login',
    component: comLogin,
    hidden: true
}]

if (VueCookies.get('token')) {
    //获取用户菜单
    request.get('/api/user/getMenu').then(response => {
        response = response.concat(developingRouter)
        response.forEach(o => {
            toComponent(o)
        });
        toHierarchy(response)
        routerData = routerData.concat(response)

        initVue()
    })

    const toComponent = function(item) {
        var componentPath = item.component,
            COMPONENT_TYPE = 100,
            IFRAME_TYPE = 200,
            WINDOW_TYPE = 300;
        if (item.component && item.type === COMPONENT_TYPE) {
            item.component = () =>
                import ('@/' + componentPath + '.vue');

        } else if (item.component && item.type === IFRAME_TYPE) {
            item.component = {
                template: "<div style='overflow: hidden;height:100%;'><iframe width='100%' height='100%' frameBorder='0' src='" + componentPath + "'></iframe></div>"
            }
        } else if (item.component && item.type === WINDOW_TYPE) {
            item.component = {
                template: componentPath
            }
        } else {
            item.component = {
                template: "<div>Unknown type or not set component property</div>"
            }
        };
    };
    const toHierarchy = function(flatArray) {
        var current, parent;
        for (var k = flatArray.length - 1; k >= 0; k--) {
            current = flatArray[k]
            if (current.pid === "" || current.pid == null) {
                continue
            }
            parent = getParent(current, flatArray)
            if (parent == null) {
                continue
            }
            if (!parent.children) {
                parent.children = []
            }
            parent.children.unshift(current)
            flatArray.splice(k, 1)
        }
        return flatArray

        function getParent(child, nodes) {
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (nodes[i].id === child.pid) {
                    return nodes[i]
                }
            }
            return null
        }
    }
} else {
    initVue()
}

function initVue() {
    new Vue({
        el: '#app',
        template: '<div id="app"><router-view></router-view></div>',
        router: new Router({ routes: routerData }),
        store,
        created() {
            if (!this.$cookies.get('token')) {
                this.$router.push({ path: '/login' })
            }
        }
    })
}