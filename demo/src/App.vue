<script setup>

</script>

<template>
    <router-view />
    <h3>按钮</h3>
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>

        <hr>
        <h3>按钮属性</h3>
        <el-button plain>朴素按钮</el-button>
        <el-button round>圆角按钮</el-button>
        <el-button circle>圆</el-button>
        <el-button disabled>禁用按钮</el-button>
        <el-button loading>加载中</el-button>

        <hr>
        <h3>尺寸</h3>
        <el-button size="large">大型按钮</el-button>
        <el-button>默认按钮</el-button>
        <el-button size="small">小型按钮</el-button>
</template>

<style scoped>

</style>

