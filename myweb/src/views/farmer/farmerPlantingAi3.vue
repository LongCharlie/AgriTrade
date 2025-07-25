<template>
  <div class="chat-container">
    <h1 class="chat-title">种植AI</h1>
    <div class="chat-log">
      <div
          v-for="(msg, index) in chatLog"
          :key="index"
          :class="['chat-message', msg.role]"
      >
        <strong>{{ msg.role === 'user' ? 'You' : 'Assistant' }}:</strong>
        <span>{{ msg.content }}</span>
      </div>
      <div v-if="loading" class="loading-message">...</div>
    </div>
    <div class="input-area">
      <textarea
          v-model="userMessage"
          placeholder="Type your message here..."
          rows="3"
      ></textarea>
      <el-button @click="sendMessage" class="send-button">Send</el-button>
    </div>
    <div class="selected-area">
      <el-select
          v-model="selectedOption"
          placeholder="选择快速回复"
          @change="insertText"
          style="margin-top: 10px;width: 200px;"
      >
        <el-option
            v-for="record in growthRecords"
            :key="record.record_id"
            :label="`id: ${record.record_id} - 种类：${record.product_name} - 创建时间：${record.created_at}`"
            :value="record.record_id"
        />
      </el-select>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../stores/user'; // 确保导入用户存储

export default {
  setup() {
    const userStore = useUserStore();
    const userMessage = ref('');
    const chatLog = ref([]);
    const loading = ref(false);
    const selectedOption = ref(null);

    const growthRecords = ref([]); // 用来存储获取到的种植记录
    const mockGrowthRecords = [
      { record_id: 51, product_name: '萝卜', province: '陕西省', growth_status: 'harvested', created_at: '2024/01/03' },
      { record_id: 56, product_name: '番茄', province: '河北省', growth_status: 'harvested', created_at: '2024/08/25' },
      { record_id: 57, product_name: '萝卜', province: '广东省', growth_status: 'harvested', created_at: '2024/10/11' },
      { record_id: 52, product_name: '南瓜', province: '陕西省', growth_status: 'growing', created_at: '2024/06/09' },
      { record_id: 53, product_name: '黄瓜', province: '陕西省', growth_status: 'harvested', created_at: '2023/12/14' },
      { record_id: 54, product_name: '番茄', province: '陕西省', growth_status: 'harvested', created_at: '2024/05/07' },
      { record_id: 55, product_name: '辣椒', province: '陕西省', growth_status: 'harvested', created_at: '2025/03/22' },
    ];

    onMounted(async () => {
      const token = userStore.token; // 从用户存储中获取 token
      try {
        const response = await axios.get('http://localhost:3000/api/growth-records', {
          headers: {
            'Authorization': `Bearer ${token}`, // 设置 Authorization 头
          },
        });
        growthRecords.value = response.data;
      } catch (error) {
        console.error('获取种植记录数据失败，使用模拟数据:', error);
        growthRecords.value = mockGrowthRecords;
      }
    });

    const sendMessage = async () => {
      if (!userMessage.value) return;

      chatLog.value.push({ role: 'user', content: userMessage.value });
      loading.value = true;

      try {
        const response = await axios.post('https://api.chatanywhere.tech/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage.value }],
          temperature: 0.7,
        }, {
          headers: {
            'Authorization': `Bearer YOUR_API_KEY`, // 替换为你的API密钥
            'Content-Type': 'application/json',
          },
        });

        const assistantMessage = response.data.choices[0].message.content;
        chatLog.value.push({ role: 'assistant', content: assistantMessage });

      } catch (error) {
        console.error('Error sending message:', error);
        chatLog.value.push({ role: 'error', content: 'Error communicating with API.' });
      } finally {
        loading.value = false;
        userMessage.value = ''; // 清空输入框
      }
    };

    const insertText = (record_id) => {
      const selectedRecord = growthRecords.value.find(record => record.record_id === record_id);
      if (selectedRecord) {
        userMessage.value = `Selected Record: ${selectedRecord.product_name}`;
      }
    };

    return {
      userMessage,
      chatLog,
      loading,
      selectedOption,
      growthRecords,
      sendMessage,
      insertText,
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
  color: #333;
}

.chat-log {
  max-height: 400px;
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
}

.user {
  background-color: #d1e7dd;
  align-self: flex-end;
  text-align: right;
}

.assistant {
  background-color: #f8d7da;
  align-self: flex-start;
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

textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  margin-right: 10px;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

.send-button {
  padding: 10px 12px;
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