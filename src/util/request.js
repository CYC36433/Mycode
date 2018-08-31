import axios from 'axios'
import VueCookies from 'vue-cookies'
import SYSCONFIG from '../../static/config'
import { Message, MessageBox } from 'element-ui'
import jsonp from 'jsonp'
import querystring from 'querystring'

if (VueCookies.get('token')) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + VueCookies.get('token')
}

axios.interceptors.response.use(response => {
    return response.data
}, error => {
    console.log(error.response) // for debug
    if (error.response.status === 500) {
        Message({
            message: "服务器端错误：<br>" + error.response.data.message,
            type: 'error',
            duration: 3 * 1000,
            dangerouslyUseHTMLString: true
        })
    } else if (error.response.status === 404) {
        Message({
            message: "404ERROR：请求的路径不存在<br>" + error.request.responseURL,
            type: 'error',
            duration: 3 * 1000,
            dangerouslyUseHTMLString: true
        })
    } else if (error.response.status === 401) {
        Message({
            message: "401ERROR：操作未授权请联系管理员",
            type: 'error',
            duration: 3 * 1000,
            dangerouslyUseHTMLString: true
        })
    } else if (error.response.status === 403) {
        VueCookies.remove('token')
        Message({
            message: "登陆信息已过期<br>即将跳转到登陆页面",
            type: 'error',
            duration: 3 * 1000,
            dangerouslyUseHTMLString: true,
            onClose() {
                window.location.href = '/#/login'
            }
        })
    } else {
        VueCookies.remove('token')
        Message({
            message: error.message + "<br>即将跳转到登陆页面",
            type: 'error',
            duration: 3 * 1000,
            dangerouslyUseHTMLString: true,
            onClose() {
                window.location.href = '/#/login'
            }
        })
    }

    return Promise.reject(error)
})

// axios.interceptors.response.use(undefined, err => {
//     let res = err.response
//     if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
//       localStorage.token = null
//       window.location = '/'
//     }
//   })

export default {
    all(promiseArr) {
        return axios.all(promiseArr)
    },
    spread: axios.spread,
    get(url, params) {
        if (!url.indexOf('http') == 0) {
            url = SYSCONFIG.host + url
        }
        return axios.get(url, { params: params })
    },
    post(url, params) {
        if (!url.indexOf('http') == 0) {
            url = SYSCONFIG.host + url
        }
        return axios.post(url, params)
    },
    jsonp(url, params) {
        if (!url.indexOf('http') == 0) {
            url = SYSCONFIG.host + url
        }
        let p = querystring.encode(params)
        url += "?" + p

        return new Promise((resolve, reject) => {
            jsonp(url, null, function(err, data) {
                resolve(data, err)
            })
        })
    }
}