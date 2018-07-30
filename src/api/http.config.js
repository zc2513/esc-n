import axios from 'axios'
import qs from 'qs'
import BaseUrl from './path.js'
import { Loading } from 'element-ui'
let loading
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {
    loading.close()
}
axios.defaults.timeout = 10000;
axios.defaults.baseURL = BaseUrl.url;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    // console.log('one')
    return config;
}, (error) => {
    console.log('0',error)
    return Promise.reject(error);
});

axios.interceptors.response.use((res) => {
    return res;
}, (error) => {
    // console.log(40, '请求未发送报错，一般为网络错误或者链接服务器失败')
    return Promise.resolve(error.response)
});
export default {
    post(url, data) {
        return axios({
            method: 'post',
            url,
            data: qs.stringify(data),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
            }).then((response) => {
                return respond(response)
            }
            ).then((res) => {
                return stateCode(res)
            }
        )
    },
    postObj(url, data) {
        return axios({
            method: 'post',
            url,
            data: data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(
            (response) => {
                return respond(response)
            }
        ).then(
            (res) => {
                return stateCode(res)
            }
        )
    },
    get(url, params) {
        return axios({
            method: 'post',
            url,
            params, // post 请求时带的参数
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return respond(response)
            }
        ).then(
            (res) => {
                return stateCode(res)
            }
        )
    }
}

function respond(response) {
    // console.log('response', response)
    // loading
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        // console.log(2)
        return response
    }
    return {// 异常状态下，把错误信息返回去
        status: -404,
        msg: '登陆超时，请重新登陆'
    }
}
function stateCode(res) {
    // console.log(res)
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {//默认不弹出
        // alert('session失效，跳转到登陆页面')
        return;
    }
    // console.log(3)
    return res.data
}