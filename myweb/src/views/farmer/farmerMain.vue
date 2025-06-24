<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <CommonAside></CommonAside>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <h1>我是farmerMain</h1>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "../../components/farmerCommonAside.vue";
export default {
  data(){
    return {}
  },
  components: {
    CommonAside
  }
}
</script>