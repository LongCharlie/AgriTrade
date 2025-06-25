<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <expert-common-aside></expert-common-aside>
      </el-aside>
      <el-container>
        <el-header>
          <expert-common-header></expert-common-header>
        </el-header>
        <el-main>
          <h1>我是Main</h1>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import expertCommonAside from "../../components/expertCommonAside.vue";
import expertCommonHeader from "../../components/expertCommonHeader.vue";
export default {
  data(){
    return {}
  },
  components: {
    expertCommonAside,
    expertCommonHeader
  }
}
</script>

<style scoped>
.el-header{
  padding: 0;
}
</style>