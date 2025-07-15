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
        <el-avatar class="avatar" shadow="hover" @click="viewDetails(2)" :src="getDefaultAvatar(topExperts[1].expert_id)" size="large" />
        <div class="podium-name">{{ topExperts[1].real_name }}</div>
        <div class="podium-score">{{ topExperts[1].answer_count }} 回答</div>
      </div>

      <!-- 第一名 -->
      <div class="podium-item first" v-if="topExperts[0]">
        <div class="podium-rank">1</div>
        <el-avatar class="avatar" shadow="hover" @click="viewDetails(1)" :src="getDefaultAvatar(topExperts[0].expert_id)" size="large" />
        <div class="podium-name">{{ topExperts[0].real_name }}</div>
        <div class="podium-score">{{ topExperts[0].answer_count }} 回答</div>
      </div>

      <!-- 第三名 -->
      <div class="podium-item third" v-if="topExperts[2]">
        <div class="podium-rank">3</div>
        <el-avatar class="avatar" shadow="hover" @click="viewDetails(3)" :src="getDefaultAvatar(topExperts[2].expert_id)" size="large" />
        <div class="podium-name">{{ topExperts[2].real_name }}</div>
        <div class="podium-score">{{ topExperts[2].answer_count }} 回答</div>
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
      <el-table-column prop="real_name" label="专家姓名" align="center" />

      <!-- 专业领域 -->
      <el-table-column prop="expertise" label="专业领域" align="center" />

      <!-- 回答数 -->
      <el-table-column prop="answer_count" label="回答数" align="center" sortable />

      <!-- 查看详情 -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="viewDetails(scope.row.expert_id)" type="text">[查看详情]</el-button>
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
        {
          expert_id: 1,
          real_name: '张三',
          title: '教授',
          institution: '中国农业科学院',
          expertise: '农业经济',
          answer_count: 45,
          expert_rank: 1,
          bio: '专注于农村经济发展与政策研究，具有丰富的实践经验。'
        },
        {
          expert_id: 2,
          real_name: '李四',
          title: '高级农艺师',
          institution: '北京农业大学',
          expertise: '植物保护',
          answer_count: 30,
          expert_rank: 2,
          bio: '长期从事农作物病虫害防治研究，发表多篇核心论文。'
        },
        {
          expert_id: 3,
          real_name: '王五',
          title: '研究员',
          institution: '南京土壤研究所',
          expertise: '土壤科学',
          answer_count: 28,
          expert_rank: 3,
          bio: '专长于土壤改良和土地可持续利用研究。'
        },
        {
          expert_id: 4,
          real_name: '赵六',
          title: '副教授',
          institution: '华中农业大学',
          expertise: '畜牧养殖',
          answer_count: 20,
          expert_rank: 4,
          bio: '研究方向为畜禽遗传育种与规模化养殖技术。'
        },
        {
          expert_id: 5,
          real_name: '陈七',
          title: '博士',
          institution: '华南农业技术中心',
          expertise: '农业机械',
          answer_count: 15,
          expert_rank: 5,
          bio: '致力于智能农机装备研发，拥有多项专利技术。'
        }
      ]
    };
  },
  mounted() {
    this.fetchExpertRank(); // 页面加载完成后立即请求排行榜数据
    //mock
    this.rankList = this.mockRankList;
    //this.updateChartData();
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
    viewDetails(expertId) {
      // 跳转到专家详情页
      this.$router.push(`/expert/detail/${expertId}`);
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
.avatar:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

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
