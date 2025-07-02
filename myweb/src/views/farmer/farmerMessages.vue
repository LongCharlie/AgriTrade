<template>
  <div id="app">
    <el-cascader
        size="large"
        :options="pcaTextArr"
        v-model="selectedOptions">
    </el-cascader>
  </div>
</template>

<script>
import { pcaTextArr } from 'element-china-area-data'
export default {
  data () {
    return {
      pcaTextArr,
      selectedOptions: []
    }
  },
}
</script>


<style scoped>
/* 添加你需要的样式 */
</style>