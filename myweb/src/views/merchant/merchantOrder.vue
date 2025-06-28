<template>
  <div class="order-content">
    <h2>订单管理</h2>
    <div class="order-list">
      <div class="order-item" v-for="order in orders" :key="order.id">
        <h3>{{ order.title }}</h3>
        <p>状态: {{ order.status }}</p>
        <p>日期: {{ order.date }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderPage',
  data() {
    return {
      orders: [
        { id: 1, title: '订单 #1001', status: '已发货', date: '2023-10-15' },
        { id: 2, title: '订单 #1002', status: '处理中', date: '2023-10-16' },
        { id: 3, title: '订单 #1003', status: '已完成', date: '2023-10-14' }
      ]
    }
  }
}
</script>

<style scoped>
.order-content {
  padding: 20px;
}

.order-list {
  margin-top: 20px;
}

.order-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-item h3 {
  color: #333;
  margin-bottom: 10px;
}

.order-item p {
  color: #666;
  margin: 5px 0;
}
</style>