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
      const id = Number(this.$route.params.id)
      try {
        //const res = await getExpertById(id)
        //mock
        const res =[
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
        this.expert = res.find(item => item.expertId === id); //mock
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
