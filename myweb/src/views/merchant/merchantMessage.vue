<template>
  <div class="container">
    <!-- 左侧用户列表 -->
    <div class="user-list">
      <h2>我的消息</h2>
      <ul class="users">
        <li
          v-for="user in users"
          :key="user.id"
          @click="selectUser(user)"
          :class="{ active: selectedUser === user }"
        >
          {{ user.name }}
        </li>
      </ul>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-container" v-if="selectedUser">
      <div class="chat-header">
        <img :src="selectedUser.avatar" alt="用户头像">
        <span>{{ selectedUser.name }}</span>
      </div>
      <div class="chat-messages">
        <div
          class="message"
          v-for="message in selectedUser.messages"
          :key="message.id"
        >
          <div v-if="message.isReceived" class="message-bubble received-bubble">
            {{ message.content }}
          </div>
          <div v-else class="message-bubble sent-bubble">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="chat-input">
        <div class="input-toolbar">
          <button class="photo-btn" @click="sendPhoto">
            <i class="el-icon-picture"></i>
          </button>
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

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const users = ref([
      {
        id: 1,
        name: '农户1',
        avatar: 'https://via.placeholder.com/35',
        messages: [
          { id: 1, content: '你好，商户1', isReceived: true },
          { id: 2, content: '这是一个测试消息', isReceived: true },
        ],
      },
      {
        id: 2,
        name: '农户2',
        avatar: 'https://via.placeholder.com/35',
        messages: [{ id: 1, content: '你好，商户2', isReceived: true }],
      },
      {
        id: 3,
        name: '农户3',
        avatar: 'https://via.placeholder.com/35',
        messages: [{ id: 1, content: '你好，商户3', isReceived: true }],
      },
      {
        id: 4,
        name: '农户4',
        avatar: 'https://via.placeholder.com/35',
        messages: [{ id: 1, content: '你好，商户4', isReceived: true }],
      },
    ]);

    const selectedUser = ref(null);
    const newMessage = ref('');

    const selectUser = (user) => {
      selectedUser.value = user;
    };

    const sendMessage = () => {
      if (newMessage.value.trim() !== '' && selectedUser.value) {
        const newMessageObj = {
          id: selectedUser.value.messages.length + 1,
          content: newMessage.value,
          isReceived: false,
        };
        selectedUser.value.messages.push(newMessageObj);
        newMessage.value = '';
      }
    };

    const sendPhoto = () => {
      if (selectedUser.value) {
        const newMessageObj = {
          id: selectedUser.value.messages.length + 1,
          content: '[图片]',
          isReceived: false,
        };
        selectedUser.value.messages.push(newMessageObj);
      }
    };

    onMounted(() => {
      if (users.value.length > 0) {
        selectedUser.value = users.value[0];
      }
    });

    return {
      users,
      selectedUser,
      newMessage,
      selectUser,
      sendMessage,
      sendPhoto,
    };
  },
};
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