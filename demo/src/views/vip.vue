	<script setup>
		//导入子组件
		import Header from "@/components/header.vue"
		import Footer from "@/components/footer.vue"
		import { useRouter } from 'vue-router';
		const router = useRouter()	
		const goTo = ()=> {
			router.push({ path: '/' })
		}
	</script>

	<template>
	    <!-- 共享的Header组件 -->
	    <Header/>

		<!-- 根据不同的子路由加载不同子页面 -->
	    <router-view /> <br>
		<router-link to="/vip">vip-home</router-link> <br>
		<router-link to="/vip/order">order</router-link> <br>
		<router-link to="/vip/info">info</router-link> <br>
		<button @click="goTo()">网站首页</button>
		
	    <!-- 共享的Footer组件 -->
	    <Footer/>

	</template>

	<style scoped>

	</style>
