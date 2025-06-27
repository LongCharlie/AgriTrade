<template>
  <div class="expert-detail">
    <h2 v-if="expert">{{ expert.realName }} 的详情</h2>
    <div v-if="expert">
      <p><strong>姓名：</strong>{{ expert.realName }}</p>
      <p><strong>职称：</strong>{{ expert.title || '暂无' }}</p>
      <p><strong>专业领域：</strong>{{ expert.expertise }}</p>
      <p><strong>回答数：</strong>{{ expert.answerCount }}</p>
    </div>
    <div v-else>
      加载中...
    </div>
  </div>
</template>

<script>
import { getExpertById } from '../../views/expert/expertApi'

export default {
  data() {
    return {
      expert: null
    }
  },
  created() {
    this.fetchExpert()
  },
  methods: {
    async fetchExpert() {
      const id = this.$route.params.id
      try {
        const res = await getExpertById(id)
        this.expert = {
          realName: res.real_name || '匿名专家',
          title: res.title || '暂无职称',
          expertise: res.expertise || '暂无领域',
          answerCount: res.answer_count || 0
        }
      } catch (error) {
        console.error('获取专家详情失败:', error)
        this.expert = null
      }
    }
  }
}
</script>
