<template>
  <div>
    <el-container style="height: 95vh;">
      <el-aside class="aside" width="200px" style="overflow: hidden;">
        <CommonAside></CommonAside>
        <CommonHeader></CommonHeader>
      </el-aside>
      <el-container style="overflow: auto; margin-top: 91px;">
        <el-main style="padding-top: 0;">
          <router-view style="margin-left: 0px; margin-right: 40px;" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "../components/merchantAside.vue";
import CommonHeader from "../components/merchantHeader.vue";
export default {
  components: {
    CommonAside,
    CommonHeader,
  },
};
</script>

<style scoped>

</style>