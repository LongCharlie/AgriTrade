export const apiRequest = async (url, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data); // 如果有数据，序列化
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '请求失败');
        }

        return await response.json(); // 返回 JSON 格式的响应
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
};

import axios from 'axios'
function f_base_get (url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
export async function get(url, params) {
    let back = null
    try{
        back = await f_base_get(url, params)
    }catch(e){
        console.log('async get', e)
    }
    return back
}

function f_base_post(url, params){
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}

//  将Promise 的错误统一捕获
export async function post (url, params) {
    let back = null
    try{
        back = await f_base_post(url, params)
    }catch(e){
        if (e.response.data === 'The CSRF token is missing.'){
            console.log('CSRF token miss, try again')
            back = await post(url, params)
        }
        console.log('async post', e)
    }
    return back
}

// //处理请求时带上token, csrf等参数，检查登录状态跳转登录，错误捕获。
// import axios from 'axios'
// import { useCookies } from "vue3-cookies";
// import router from '@/router'
// import {ElMessage} from "element-plus";
//
// const { cookies } = useCookies();
//
// axios.defaults.timeout = 50000;
//
// // 请求拦截器
// axios.interceptors.request.use(
//     config => {
//         // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
//         // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
//         config.headers['X-CSRFToken'] = cookies.get("csrf_token")
//         if(config.method.toUpperCase() === 'POST') {
//             config.headers['Content-Type'] = 'application/json;charset=utf-8'
//         }
//         return config
//     },
//     error => {
//         return Promise.error(error)
//     })
//
// // 返回拦截器
// axios.interceptors.response.use(
//     res => {
//         const back_data = res.data
//         if (back_data.code === 20000){
//             router.push('/login')
//         }
//         return Promise.resolve(res);
//     },
//     error => {
//         switch (error.response.status) {
//             case 500:
//                 ElMessage.error('Oops,Server Error.')
//                 break
//             case 404:
//                 ElMessage.error('Oops, Not Find!')
//                 break
//             case 400:
//                 // ElMessage.error('Oops, 400!')
//                 break
//             // 其他错误，直接抛出错误提示
//             default:
//                 ElMessage.error(error.message)
//         }
//         return Promise.reject(error);
//     }
// );
//
// function f_base_get (url, params) {
//     return new Promise((resolve, reject) => {
//         axios.get(url, params)
//             .then(res => {
//                 resolve(res.data)
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }
//
// function f_base_post(url, params){
//     return new Promise((resolve, reject) => {
//         axios.post(url, params)
//             .then(res => {
//                 resolve(res.data)
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }
//
// //  将Promise 的错误统一捕获
// export async function post (url, params) {
//     let back = null
//     try{
//         back = await f_base_post(url, params)
//     }catch(e){
//         if (e.response.data === 'The CSRF token is missing.'){
//             console.log('CSRF token miss, try again')
//             back = await post(url, params)
//         }
//         console.log('async post', e)
//     }
//     return back
// }
//
// export async function get(url, params) {
//     let back = null
//     try{
//         back = await f_base_get(url, params)
//     }catch(e){
//         console.log('async get', e)
//     }
//     return back
// }
