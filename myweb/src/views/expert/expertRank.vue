<!--<template>-->
<!--  <div>-->
<!--    <h1>我是Rank</h1>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--import { getExpertRank } from '../../views/expert/expertApi'-->
<!--export default {-->
<!--  data(){-->
<!--    return {}-->
<!--  },-->
<!--  mounted() {-->
<!--    getExpertRank().then(res => {-->
<!--      console.log(res)-->
<!--    })-->
<!--  }-->
<!--}-->
<!--</script>-->

<template>
  <div class="expert-rank-container">
    <h2>专家排行榜</h2>

    <el-table :data="rankList" style="width: 100%" border :default-sort="{ prop: 'answerCount', order: 'descending' }">
      <!-- 排名 -->
      <el-table-column label="排名" width="80" align="center">
        <template #default="scope">
          <span :class="['rank-number', { 'top-three': scope.$index < 3 }]">
            {{ scope.$index + 1 }}
          </span>
        </template>
      </el-table-column>

      <!-- 头像 -->
      <el-table-column label="头像" width="100" align="center">
        <template #default="scope">
          <el-avatar :src="getDefaultAvatar(scope.row.expertId)" size="large" />
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
          <el-button @click="viewDetails(scope.row)" type="text">查看详情</el-button>
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

export default {
  data() {
    return {
      rankList: [], // 存储排行榜数据
    };
  },
  mounted() {
    this.fetchExpertRank(); // 页面加载完成后立即请求排行榜数据
  },
  methods: {
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
        }
      } catch (error) {
        console.error('获取专家排行榜失败:', error);
        this.rankList = [];
      }
    },
    getDefaultAvatar(expertId) {
      /////////////////////////////////////
      return `https://via.placeholder.com/60?text=Exp${expertId}`;
    },
    viewDetails(row) {
      // 跳转到专家详情页
      this.$router.push(`/expert/detail/${row.expertId}`);
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
</style>
