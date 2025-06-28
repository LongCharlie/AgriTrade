<template>
  <div>
    <!-- 采购页面内容 -->
    <button @click="addNewPurchase">新增采购</button>
  </div>
</template>

<script>
export default {
  methods: {
    addNewPurchase() {
      // 触发父组件(MainLayout)中的方法
      this.$emit('add-purchase');
    }
  }
}
</script>