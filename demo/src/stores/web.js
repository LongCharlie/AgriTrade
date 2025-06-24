import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

/*
  定义一个基于 Pinia 的 Store
  第1个参数 web 是 useWebStore 在应用中的唯一标识符(ID)
  第2个参数是 Setup函数 或 Option对象
*/
export const useWebStore = defineStore('web', () => {
  //定义一个响应式对象，存储网站信息
  const web = reactive({
    title: "邓瑞编程",
    url: "dengruicode.com"
  })

  //定义一个响应式引用，存储用户数
  const users = ref(1000)
  
  //定义方法
  const userAdd = () => {
    users.value++
  }

  return {
    web,
    users,
    userAdd
  }
},
{
  //持久化存储到 localStorage 中
  persist: true
})