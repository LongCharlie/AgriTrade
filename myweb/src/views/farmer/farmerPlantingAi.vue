<template>
  <div class="chat-container">
    <h1 class="chat-title">种植AI</h1>
    <div class="chat-log">
      <div
          v-for="(msg, index) in chatLog"
          :key="index"
          :class="['chat-message', msg.role]"
      >
        <el-card class="message-card" :body-style="{ padding: '20px' }">
          <strong>{{ msg.role === 'user' ? '用户' : 'Assistant' }}:</strong>
          <span v-html="formatMessage(msg.content)"></span>
        </el-card>
      </div>
      <div v-if="loading" class="loading-message">...</div>
    </div>
    <div class="input-area">
      <el-input
          type="textarea"
          v-model="userMessage"
          placeholder="请输入您的问题"
          rows="3"
          :autosize="{ minRows: 3, maxRows: 4 }"
      ></el-input>
      <el-button @click="sendMessage" class="send-button">发送</el-button>
    </div>
    <div class="selected-area">
      <!--  1.某个种植记录的信息以及所有种植活动信息   -->
      <el-select
          v-model="selectedOption"
          placeholder="选择种植记录"
          @change="onSelectChange"
          style="margin-top: 10px; width: 200px;"
      >
        <el-option
            v-for="record in growthRecords"
            :key="record.record_id"
            :label="`id: ${record.record_id} - 种类：${record.product_name} - 创建时间：${record.created_at}`"
            :value="record.record_id"
        />
      </el-select>
      <!--  2.某个提问的问题和回答信息      -->
      <el-select
          v-model="selectedQuestion"
          placeholder="选择提问"
          @change="onQuestionChange"
          style="margin-left: 10px; margin-top: 10px; width: 200px;"
      >
        <el-option
            v-for="question in filteredQuestions"
            :key="question.question_id"
            :label="`id: ${question.question_id} - 标题：${truncateText(question.title, 15)}`"
            :value="question.question_id"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../stores/user';
import cropPhoto from "@/assets/platform_logo2.png"; // 导入用户存储

export default {
  setup() {
    const userStore = useUserStore();
    const userMessage = ref('');
    const chatLog = ref([]);
    const loading = ref(false);
    const selectedOption = ref(null);
    const selectedQuestion = ref(null);
    const growthRecords = ref([]); // 存储获取到的种植记录
    const historicalRecords = ref([]); // 存储获取到的历史记录
    const questions = ref([]); // 存储获取到的问题和回答

    const mockGrowthRecords = [
      { record_id: 51, product_name: '萝卜', province: '陕西省', growth_status: 'harvested', created_at: '2024/01/03' },
      { record_id: 56, product_name: '番茄', province: '河北省', growth_status: 'harvested', created_at: '2024/08/25' },
      { record_id: 57, product_name: '萝卜', province: '广东省', growth_status: 'harvested', created_at: '2024/10/11' },
      { record_id: 52, product_name: '南瓜', province: '陕西省', growth_status: 'growing', created_at: '2024/06/09' },
      { record_id: 53, product_name: '黄瓜', province: '陕西省', growth_status: 'harvested', created_at: '2023/12/14' },
      { record_id: 54, product_name: '番茄', province: '陕西省', growth_status: 'harvested', created_at: '2024/05/07' },
      { record_id: 55, product_name: '辣椒', province: '陕西省', growth_status: 'harvested', created_at: '2025/03/22' },
    ];

    const mockHistoricalRecords = [
      { activity_id: 1, activity_date: '2023-05-01', activity_type: 'seeding', description: '使用XX牌种子', images: `${cropPhoto},${cropPhoto}` },
      { activity_id: 2, activity_date: '2023-05-05', activity_type: 'fertilizing', description: '施用氮肥', images: cropPhoto },
      { activity_id: 3, activity_date: '2023-05-07', activity_type: 'pesticide', description: '喷洒病虫害防治药物', images: `${cropPhoto},${cropPhoto},${cropPhoto}` },
      { activity_id: 4, activity_date: '2023-05-15', activity_type: 'harvest', description: '首次收获', images: cropPhoto },
    ];

    const mockQuestions = [
      {
        question_id: 1,
        title: '如何防治番茄晚疫病？',
        content: '我的番茄种植过程中出现了晚疫病症状，叶片出现水渍状斑点，应该如何防治？',
        status: 'open',
        farmer_id: 1,
        created_at: '2024-05-10'
      },
      {
        question_id: 2,
        title: '萝卜种植间距问题',
        content: '种植萝卜时株距和行距应该是多少比较合适？',
        status: 'close',
        farmer_id: 1,
        created_at: '2024-06-15'
      },
      {
        question_id: 3,
        title: '黄瓜病虫害防治',
        content: '黄瓜叶子发黄是什么原因？',
        status: 'close',
        farmer_id: 2, // 不是当前用户的问题
        created_at: '2024-06-15'
      }
    ];

    // 计算属性：筛选问题
    const filteredQuestions = computed(() => {
      const userId = userStore.userId;
      return questions.value.filter(question => {
        // 显示状态为open的问题 或者 状态为close且提问者是自己的问题
        return question.status === 'open' ||
            (question.farmer_id === userId);
      });
    });

    onMounted(async () => {
      const token = userStore.token; // 从用户存储中获取 token
      try {
        const response = await axios.get('http://localhost:3000/api/growth-records', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        growthRecords.value = response.data;
        const questionResponse = await axios.get('http://localhost:3000/api/questions/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        questions.value = questionResponse.data.questions;
      } catch (error) {
        console.error('获取种植记录数据失败，使用模拟数据:', error);
        growthRecords.value = mockGrowthRecords;
        questions.value = mockQuestions;
      }
    });

    const sendMessage = async () => {
      if (!userMessage.value) return;

      chatLog.value.push({ role: 'user', content: userMessage.value });
      loading.value = true;
      userMessage.value = ''; // 清空输入框
      selectedOption.value = null;
      selectedQuestion.value = null;
      try {
        const response = await axios.post('https://api.chatanywhere.tech/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage.value }],
          temperature: 0.7,
        }, {
          headers: {
            'Authorization': `Bearer KEY`,//
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data.choices[0].message.content);
        const assistantMessage = response.data.choices[0].message.content;
        chatLog.value.push({ role: 'assistant', content: assistantMessage });
      } catch (error) {
        console.error('Error sending message:', error);
        chatLog.value.push({ role: 'error', content: 'Error communicating with API.' });
      } finally {
        loading.value = false;

      }
    };

    const fetchHistoricalRecords = async (recordId) => {
      const token = userStore.token; // 从用户存储中获取 token
      try {
        const response = await axios.get(`http://localhost:3000/api/historical-activity/${recordId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        historicalRecords.value = response.data; // 假设接口返回的数据符合预期
      } catch (error) {
        console.error('获取历史活动失败，使用模拟数据:', error);
        historicalRecords.value = mockHistoricalRecords; // 使用模拟数据
      }
    };

    const onSelectChange = async (record_id) => {
      await fetchHistoricalRecords(record_id); // 调用接口获取历史活动
      // 在这里构造用户消息
      const selectedRecord = growthRecords.value.find(record => record.record_id === record_id);
      if (selectedRecord && historicalRecords.value.length) {
        const description = historicalRecords.value.map(record => {
          return `日期: ${record.activity_date}, 活动类型: ${getChineseActivityType(record.activity_type)}, 描述: ${record.description}`;
        }).join('\n'); // 将历史记录信息合并为字符串
        userMessage.value = `种植作物种类: ${selectedRecord.product_name}, 位置: ${selectedRecord.province}\n种植历史记录:\n${description}`;
      }
    };

    const onQuestionChange = (question_id) => {
      const selectedQuestion = filteredQuestions.value.find(q => q.question_id === question_id);
      if (selectedQuestion) {
        userMessage.value = `问题标题: ${selectedQuestion.title}\n问题描述: ${selectedQuestion.content}\n`;
      }
      selectedOption.value = null; // 清除另一个选择
    };

    const getChineseActivityType = (type) => {
      const typeMapping = {
        seeding: '播种',
        fertilizing: '施肥',
        pesticide: '喷药',
        harvest: '收获',
        other: '其他',
      };
      return typeMapping[type] || type; // 如果未找到对应类型，返回原值
    };

    const formatMessage = (message) => {
      return message.replace(/\n/g, '<br/>'); // 将换行符替换为 <br/> 标签
    };

    const truncateText = (text, length) => {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    };

    return {
      userMessage,
      chatLog,
      loading,
      selectedOption,
      growthRecords,
      questions,
      filteredQuestions, // 暴露筛选后的问题列表
      selectedQuestion,
      sendMessage,
      onSelectChange,
      onQuestionChange,
      formatMessage, // 暴露格式化函数
      truncateText
    };
  },
};
</script>

<style scoped>
.chat-container {
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  margin-top: 0px;
  color: #333;
}

.chat-log {
  max-height: 350px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #f9f9f9;
}

.chat-message {
  margin: 5px 0;
  padding: 8px 10px;
  border-radius: 5px;
  display: flex; /* 使用 Flex 布局 */
  justify-content: flex-start; /* 左对齐 */
}

.message-card {
  margin-bottom: 5px; /* 调整卡片间距 */
  width: 100%; /* 确保卡片宽度为 100% */
}

.message-card strong {
  display: inline-block; /* 让强制文本显示为块元素，便于布局 */
}

.user .message-card {
  background-color: #d1e7dd; /* 用户消息背景色 */
}

.assistant .message-card {
  background-color: #f8d7da; /* 助手消息背景色 */
}

.loading-message {
  text-align: center;
  color: #aaa;
}

.input-area {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.selected-area {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.send-button {
  padding: 10px 12px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>
