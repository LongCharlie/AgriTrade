<!--<template>-->
<!--  <div>-->
<!--    <el-row>-->
<!--      <el-button round>圆角按钮</el-button>-->
<!--      <el-button type="primary" round>主要按钮</el-button>-->
<!--      <el-button type="success" round>成功按钮</el-button>-->
<!--      <el-button type="info" round>信息按钮</el-button>-->
<!--      <el-button type="warning" round>警告按钮</el-button>-->
<!--      <el-button type="danger" round>危险按钮</el-button>-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->
<template>
  <h1>Hello App!</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/home">Go to Home</RouterLink>
    <RouterLink to="/user">Go to User</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<script>

export default {
  name: 'App'
}
</script>
