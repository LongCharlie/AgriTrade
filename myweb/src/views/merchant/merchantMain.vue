<template>
  <div class="app">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        耘联
        <span class="menu-icon">≡</span>
      </div>
      <div class="sidebar-item active">
        <div class="sidebar-icon">🏠</div>
        首页
      </div>
      <div class="sidebar-item">
        <div class="sidebar-icon">📦</div>
        采购
      </div>
      <div class="sidebar-item">
        <div class="sidebar-icon">📝</div>
        订单
      </div>
      <div class="sidebar-item">
        <div class="sidebar-icon">💬</div>
        消息
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="header">
        <div class="user-profile">
        </div>
      </div>

      <!-- 轮播图区域 -->
      <div class="carousel-container">
        <div class="carousel" :style="{ transform: `translateX(-${currentIndex * 33.33}%)` }">
          <div class="carousel-item" v-for="(image, index) in carouselImages" :key="index">
            <img :src="image" alt="轮播图" style="max-width: 100%; max-height: 100%;">
          </div>
        </div>

        <div class="carousel-indicators">
          <div class="indicator" 
               v-for="(image, index) in carouselImages" 
               :key="index + '-indicator'"
               :class="{ active: currentIndex === index }"
               @click="setActiveSlide(index)"></div>
        </div>

        <div class="carousel-btn prev-btn" @click="prevSlide">❮</div>
        <div class="carousel-btn next-btn" @click="nextSlide">❯</div>

        <div class="carousel-caption">轮播图</div>
      </div>

      <!-- 功能按钮区域 -->
      <div class="actions">
        <div class="action-btn" @click="$router.push('/farmer')">我的主页</div>
        <div class="action-btn" @click="navigateTo('publish')">发布采购</div>
        <div class="action-btn" @click="$router.push('/merchant/purchases')">我的采购</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      currentIndex: 0,
      carouselImages: [
        'https://via.placeholder.com/800x200?text=轮播图1',
        'https://via.placeholder.com/800x200?text=轮播图2',
        'https://via.placeholder.com/800x200?text=轮播图3'
      ],
      intervalId: null
    }
  },
  methods: {
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length
    },
    setActiveSlide(index) {
      this.currentIndex = index
    },
    autoSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length
    },
    navigateTo(path) {
      console.log(`导航到: ${path}`)
    }
  },
  mounted() {
    this.intervalId = setInterval(this.autoSlide, 3000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

body {
  background-color: #f5f5f5;
  color: #333;
}

.app {
  display: flex;
  background-color: #b9eeb7ad;
  min-height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  width: 160px;
  background-color: #ffffff00;
  padding: 20px 0;
  height: 150vh;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  font-size: 24px;
  font-weight: bold;
  color: #2e7d32;
}

.menu-icon {
  margin-left: 10px;
  font-size: 20px;
}

.sidebar-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #2e7d32;
}

.sidebar-item:hover {
  background-color: #c5e1a5;
}

.sidebar-item.active {
  background-color: #aed581;
  border-radius: 8px;
}

.sidebar-icon {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}


.user-profile {
  display: flex;
  align-items: center;
}

/* 轮播图区域 */
.carousel-container {
  width: 100%;
  height: 380px;
  background-color: #eee;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
}

.carousel {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-item {
  width: 33.33%;
  height: 100%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 5px;
  cursor: pointer;
}

.indicator.active {
  background-color: white;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #666;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.carousel-caption {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 15px;
  border-radius: 15px;
  color: #666;
}

/* 功能按钮区域 */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.action-btn {
  width: 30%;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
}

.action-btn:hover {
  transform: scale(1.05);
}

.action-btn:nth-child(1) {
  background-color: #aed581;
}

.action-btn:nth-child(2) {
  background-color: #c5e1a5;
}

.action-btn:nth-child(3) {
  background-color: #689f38;
}
</style>