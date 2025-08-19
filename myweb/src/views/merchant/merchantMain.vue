<template>
  <div>
    <div class="header">
      <div class="user-profile">
        <!-- 用户信息区域 -->
      </div>
    </div>
    
    <!-- 轮播图区域 -->
     <div class="container">
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
      </div>
      </div>
    <!-- 功能按钮区域 -->
    <div class="actions">
      <div class="action-btn" @click="navigateTo('myhome')">我的主页</div>
      <div class="action-btn" @click="navigateTo('publish')">发布采购</div>
      <div class="action-btn" @click="navigateTo('mypurchase')">我的采购</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      currentIndex: 0,
      carouselImages: [
        '/images/2.jpg',
        'images/3.jpg',
        '/images/1.jpg'
      ],
      intervalId: null
    }
  },
  methods: {
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    },
    setActiveSlide(index) {
      this.currentIndex = index;
    },
    autoSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    },
    navigateTo(path) {
      if (path === 'myhome') {
        this.$router.push('/MerchantHome');
      } else if (path === 'publish') {
        this.$router.push('/addPurchase');
      } else if (path === 'mypurchase') {
        this.$router.push('/purchases');
      }
    }
  },
  mounted() {
    this.intervalId = setInterval(this.autoSlide, 3000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
}
</script>

<style scoped>
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
.container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.carousel-container {
  width: 800px;
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
  margin-top: 10px;
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