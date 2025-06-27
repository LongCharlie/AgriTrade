<template>
  <div>
    <el-container style="height: 100vh;">
      <el-aside class="aside" width="200px" style="overflow: hidden;">
        <CommonAside></CommonAside>
      </el-aside>
      <el-container style="overflow: auto; margin-top: 91px;">
        <el-main style="padding-top: 0;">
          <router-view style="margin-left: 20px;" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "../components/farmerCommonAside.vue";
export default {
  components: {
    CommonAside,
  },
};
</script>

<style scoped>

</style>