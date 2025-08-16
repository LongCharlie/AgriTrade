<template>
  <div class="container">
    <!-- 左侧用户列表 -->
    <div class="user-list">
      <h2>我的消息</h2>
      <ul class="users">
        <li
          v-for="user in users"
          :key="user.chat_id"
          @click="selectUser(user)"
          :class="{ active: selectedUser?.chat_id === user.chat_id }"
        >
          {{ user.other_user_name }}
        </li>
      </ul>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-container" v-if="selectedUser">
      <div class="chat-header">
        <img :src="selectedUser.other_user_avatar" alt="用户头像" />
        <span>{{ selectedUser.other_user_name }}</span>
      </div>

      <div class="chat-messages">
        <div
          class="message"
          v-for="message in selectedUser.messages"
          :key="message.id"
        >
          <div
            v-if="message.isReceived"
            class="message-bubble received-bubble"
          >
            {{ message.type === 'image' ? '[图片]' : message.content }}
          </div>
          <div v-else class="message-bubble sent-bubble">
            {{ message.type === 'image' ? '[图片]' : message.content }}
          </div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-toolbar">
          <button class="photo-btn" @click="triggerFileInput">
            <i class="el-icon-picture"></i>
          </button>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        <div class="input-area">
          <textarea
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="输入消息..."
          ></textarea>
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const users = ref([])
const selectedUser = ref(null)
const newMessage = ref('')
const fileInput = ref(null)

let pollingTimer = null

// 获取会话列表
const fetchChatList = async () => {
  try {
    const res = await axios.get('/api/chat/list', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    users.value = res.data.map(chat => ({
      ...chat,
      messages: []
    }))
  } catch (err) {
    console.error('获取会话列表失败:', err)
    ElMessage.error('获取会话列表失败')
  }
}

// 获取消息记录
const selectUser = async (user) => {
  selectedUser.value = user
  await fetchMessages()
  startPolling()
}

// 拉取消息记录
const fetchMessages = async () => {
  if (!selectedUser.value) return
  try {
    const res = await axios.get(`/api/chat/${selectedUser.value.chat_id}/messages`, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    selectedUser.value.messages = res.data.map(msg => ({
      id: msg.message_id,
      content: msg.content,
      isReceived: msg.sender_id !== userStore.userId,
      type: msg.type,
      timestamp: msg.timestamp
    }))
  } catch (err) {
    console.error('获取消息记录失败:', err)
    ElMessage.error('获取消息记录失败')
  }
}

// 发送文本消息
const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  try {
    const res = await axios.post('/api/chat/send', {
      content: newMessage.value,
      other_user_id: selectedUser.value.other_user_id
    }, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    selectedUser.value.messages.push({
      id: res.data.message_id,
      content: newMessage.value,
      isReceived: false,
      type: 'text',
      timestamp: res.data.timestamp
    })
    newMessage.value = ''
  } catch (err) {
    console.error('发送消息失败:', err)
    ElMessage.error('发送消息失败')
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('image', file)

    const uploadRes = await axios.post('/api/upload/image', formData, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    const imageUrl = uploadRes.data.url
    await sendImageMessage(imageUrl)
  } catch (err) {
    console.error('图片上传失败:', err)
    ElMessage.error('图片上传失败')
  } finally {
    fileInput.value.value = ''
  }
}

// 发送图片消息
const sendImageMessage = async (imageUrl) => {
  try {
    const res = await axios.post('/api/chat/send', {
      image_url: imageUrl,
      other_user_id: selectedUser.value.other_user_id
    }, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    selectedUser.value.messages.push({
      id: res.data.message_id,
      content: '[图片]',
      isReceived: false,
      type: 'image',
      timestamp: res.data.timestamp
    })
  } catch (err) {
    console.error('发送图片消息失败:', err)
    ElMessage.error('发送图片消息失败')
  }
}

// 启动轮询
const startPolling = () => {
  stopPolling()
  pollingTimer = setInterval(fetchMessages, 5000)
}

// 停止轮询
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

onMounted(() => {
  fetchChatList()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", sans-serif;
}

.container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 100vh;
}

.user-list {
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 20px 0;
}

.user-list h2 {
  padding: 0 20px 15px;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #eee;
}

.users {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.users li {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.users li:hover {
  background-color: #f5f5f5;
}

.users li.active {
  background-color: #7b7b7b1d;
  border-left: 3px solid #000000;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.chat-header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
}

.chat-header img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 70%;
  word-break: break-word;
}

.received-bubble {
  background-color: #f1f1f1;
  margin-right: auto;
  border-bottom-left-radius: 2px;
}

.sent-bubble {
  background-color: #dcf8c6;
  margin-left: auto;
  border-bottom-right-radius: 2px;
}

.chat-input {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eee;
}

.input-toolbar {
  display: flex;
  padding: 0px;
  background-color: #fff;
}

.photo-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-right: 10px;
  color: #666;
}

.input-area {
  display: flex;
  flex: 1;
}

textarea {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  resize: none;
  min-height: 100px;
}

button {
  padding: 8px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  align-self: flex-end;
  margin-right: 10px;
}
</style>