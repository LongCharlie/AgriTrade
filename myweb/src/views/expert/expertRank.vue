<template>
  <div class="expert-rank-container">
    <h2>专家排行榜</h2>
    <!-- 折线图有问题 -->
<!--    <bar-chart :data="chartData" style="height: 400px; width: 100%;" />-->

    <!-- 领奖台 -->
    <div class="podium">
      <!-- 第二名 -->
      <div class="podium-item second" v-if="topExperts[1]">
        <div class="podium-rank">2</div>
        <el-avatar @click="viewDetails" :src="getDefaultAvatar(topExperts[1].expertId)" size="large" />
        <div class="podium-name">{{ topExperts[1].realName }}</div>
        <div class="podium-score">{{ topExperts[1].answerCount }} 回答</div>
      </div>

      <!-- 第一名 -->
      <div class="podium-item first" v-if="topExperts[0]">
        <div class="podium-rank">1</div>
        <el-avatar :src="getDefaultAvatar(topExperts[0].expertId)" size="large" />
        <div class="podium-name">{{ topExperts[0].realName }}</div>
        <div class="podium-score">{{ topExperts[0].answerCount }} 回答</div>
      </div>

      <!-- 第三名 -->
      <div class="podium-item third" v-if="topExperts[2]">
        <div class="podium-rank">3</div>
        <el-avatar :src="getDefaultAvatar(topExperts[2].expertId)" size="large" />
        <div class="podium-name">{{ topExperts[2].realName }}</div>
        <div class="podium-score">{{ topExperts[2].answerCount }} 回答</div>
      </div>
    </div>

    <el-input class="search-bar" placeholder="输入姓名或领域进行搜索" v-model="searchKeyword" clearable />

    <el-table :data="filteredRankList" style="width: 100%" :default-sort="{ prop: 'answerCount', order: 'descending' }">
      <!-- 排名 -->
      <el-table-column label="排名" width="80" align="center">
        <template #default="scope">
          <span :class="['rank-number', { 'top-three': scope.$index < 3 }]">
            {{ scope.$index + 1 }}
          </span>
        </template>
      </el-table-column>

      <!-- 姓名 -->
      <el-table-column prop="realName" label="专家姓名" align="center" />

      <!-- 专业领域 -->
      <el-table-column prop="expertise" label="专业领域" align="center" />

      <!-- 回答数 -->
      <el-table-column prop="answerCount" label="回答数" align="center" sortable />

      <!-- 查看详情 -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="viewDetails(scope.row)" type="text">[查看详情]</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空数据提示 -->
    <div v-if="!rankList.length" class="no-data">
      暂无专家数据
    </div>
  </div>
</template>

<script>
import { getExpertRank } from '../../views/expert/expertApi';
//import { BarChart } from 'vue-echarts'
import Fuse from 'fuse.js';

export default {
  components: {
    //BarChart
  },
  data() {
    return {
      chartData: {
        columns: ['专家姓名', '回答数'],
        rows: [] // 先设为空数组
      },
      rankList: [],
      searchKeyword: '',
      //mock
      mockRankList: [
        { expertId: 1, realName: '张三', expertise: '农业经济', answerCount: 45 },
        { expertId: 2, realName: '李四', expertise: '植物保护', answerCount: 30 },
        { expertId: 3, realName: '王五', expertise: '土壤科学', answerCount: 28 },
        { expertId: 4, realName: '赵六', expertise: '畜牧养殖', answerCount: 20 },
        { expertId: 5, realName: '陈七', expertise: '农业机械', answerCount: 15 }
      ]
    };
  },
  mounted() {
    this.fetchExpertRank(); // 页面加载完成后立即请求排行榜数据
    //mock
    this.rankList = this.mockRankList;
    this.updateChartData();
  },
  methods: {
    getDefaultAvatar(expertId) {
      // 使用 DiceBear 提供的 SVG 头像服务（可替换为自己的图片地址）
      return `https://avatars.dicebear.com/api/avataaars/${expertId}.svg?background=%23fff`;
    },
    filterRankListWithFuzzy(keyword) {
      if (!keyword) return this.rankList;

      const fuse = new Fuse(this.rankList, { keys: ['realName', 'expertise'] });
      return fuse.search(keyword).map(result => result.item);
    },
    async fetchExpertRank() {
      try {
        const res = await getExpertRank();
        console.log('获取到的排行榜数据:', res);
        if (res && Array.isArray(res)) {
          this.rankList = res.map((item) => ({
            expertId: item.expert_id,
            realName: item.real_name || '匿名专家',
            expertise: item.expertise || '暂无领域',
            answerCount: item.answer_count || 0
          }));
          // // 更新 chartData
          // this.chartData = {
          //   ...this.chartData,
          //   rows: this.rankList.map(item => ({
          //     '专家姓名': item.realName,
          //     '回答数': item.answerCount
          //   }))
          // };
        }
      } catch (error) {
        console.error('获取专家排行榜失败:', error);
        this.rankList = [];
      }
    },
    //mock
    updateChartData() {
      this.chartData = {
        columns: ['专家姓名', '回答数'],
        rows: this.rankList.map(item => ({
          '专家姓名': item.realName,
          '回答数': item.answerCount
        }))
      };
    },
    viewDetails(row) {
      // 跳转到专家详情页
      this.$router.push(`/expert/detail/${row.expertId}`);
    }
  },
  computed: {
    filteredRankList() {
      const keyword = this.searchKeyword;
      return this.filterRankListWithFuzzy(keyword);
    },
    topExperts() {
      // 确保 rankList 已排序
      const sorted = [...this.filteredRankList].sort((a, b) => b.answerCount - a.answerCount);
      return sorted.slice(0, 3); // 前三名
    }
  }
};
</script>

<style scoped>
.expert-rank-container {
  padding: 20px;
}

.rank-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  color: #666;
}

.rank-number.top-three {
  background-color: #ffd700;
  color: #fff;
  font-weight: bold;
}

.no-data {
  text-align: center;
  margin-top: 20px;
  color: #999;
}

.search-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 40px;
  margin: 40px 0;
  position: relative;
}

.podium-item {
  text-align: center;
  transition: transform 0.3s ease;
}

.podium-item.first {
  height: 220px;
  z-index: 3;
}

.podium-item.second {
  height: 180px;
  z-index: 2;
}

.podium-item.third {
  height: 140px;
  z-index: 1;
}

.podium-rank {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background-color: #999;
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  margin: 0 auto 10px;
}

.podium-item.first .podium-rank { background-color: gold; }
.podium-item.second .podium-rank { background-color: silver; }
.podium-item.third .podium-rank { background-color: #cd7f32; }

.podium-name {
  font-size: 16px;
  margin-top: 8px;
  font-weight: bold;
}

.podium-score {
  font-size: 14px;
  color: #666;
}

</style>
