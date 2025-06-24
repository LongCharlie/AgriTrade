<script setup>
    import { useRouter } from 'vue-router';
	    const router = useRouter()

	    let userId = 100
	    let userName = "luo"

	    const goTo = ()=> {
	        router.push({ path: '/vip' })
	    }
</script>

<template>
    <h3>首页</h3>
    <!-- 编程式导航 -->
    <button @click="goTo()">vip主页</button>
</template>

<style scoped>

</style>