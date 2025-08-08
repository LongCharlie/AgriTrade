<!--<template>-->
<!--  <div class="post-question-container">-->
<!--&lt;!&ndash;    <el-page-header @back="goBack" content="发布问题"></el-page-header>&ndash;&gt;-->

<!--    <el-card shadow="hover" class="post-question-card">-->
<!--      <div class="card-header">-->
<!--        <h3>填写问题信息</h3>-->
<!--      </div>-->

<!--      <el-form-->
<!--          :model="questionForm"-->
<!--          :rules="questionRules"-->
<!--          ref="questionForm"-->
<!--          label-width="100px"-->
<!--          class="question-form">-->

<!--        <el-form-item label="问题标题" prop="title">-->
<!--          <el-input-->
<!--              v-model="questionForm.title"-->
<!--              placeholder="请输入问题标题（例如：如何防治水稻病虫害）"-->
<!--              maxlength="100"-->
<!--              show-word-limit>-->
<!--          </el-input>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="问题描述" prop="content">-->
<!--          <el-input-->
<!--              type="textarea"-->
<!--              :rows="8"-->
<!--              placeholder="请详细描述您的问题，包括作物种类、出现的问题、已经采取的措施等"-->
<!--              v-model="questionForm.content"-->
<!--              maxlength="1000"-->
<!--              show-word-limit>-->
<!--          </el-input>-->
<!--        </el-form-item>-->

<!--&lt;!&ndash;        <el-form-item label="问题分类" prop="category">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-select&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="questionForm.category"&ndash;&gt;-->
<!--&lt;!&ndash;              placeholder="请选择问题分类"&ndash;&gt;-->
<!--&lt;!&ndash;              style="width: 100%">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option&ndash;&gt;-->
<!--&lt;!&ndash;                v-for="category in categories"&ndash;&gt;-->
<!--&lt;!&ndash;                :key="category.value"&ndash;&gt;-->
<!--&lt;!&ndash;                :label="category.label"&ndash;&gt;-->
<!--&lt;!&ndash;                :value="category.value">&ndash;&gt;-->
<!--&lt;!&ndash;            </el-option>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-select>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->

<!--        <el-form-item>-->
<!--          <div class="form-actions">-->
<!--            <el-button @click="resetForm">重置</el-button>-->
<!--            <el-button-->
<!--                type="primary"-->
<!--                @click="submitQuestion"-->
<!--                :loading="submitting">-->
<!--              {{ submitting ? '提交中...' : '提交问题' }}-->
<!--            </el-button>-->
<!--          </div>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-card>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import axios from "axios";-->
<!--import { useUserStore } from '@/stores/user';-->

<!--export default {-->
<!--  name: 'FarmerPostQuestion',-->
<!--  setup() {-->
<!--    const userStore = useUserStore();-->
<!--    return {-->
<!--      userStore-->
<!--    };-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      submitting: false,-->
<!--      questionForm: {-->
<!--        title: '',-->
<!--        content: '',-->
<!--        //category: ''-->
<!--      },-->
<!--      questionRules: {-->
<!--        title: [-->
<!--          { required: true, message: '请输入问题标题', trigger: 'blur' },-->
<!--          { min: 1, max: 100, message: '标题长度应在 1 到 100 个字符之间', trigger: 'blur' }-->
<!--        ],-->
<!--        content: [-->
<!--          { required: true, message: '请输入问题描述', trigger: 'blur' },-->
<!--          { min: 5, message: '问题描述至少需要 5 个字符', trigger: 'blur' }-->
<!--        ],-->
<!--        // category: [-->
<!--        //   { required: true, message: '请选择问题分类', trigger: 'change' }-->
<!--        // ]-->
<!--      },-->
<!--      // categories: [-->
<!--      //   { value: 'planting', label: '种植技术' },-->
<!--      //   { value: 'fertilization', label: '施肥管理' },-->
<!--      //   { value: 'pest-control', label: '病虫害防治' },-->
<!--      //   { value: 'irrigation', label: '灌溉管理' },-->
<!--      //   { value: 'harvesting', label: '收获储藏' },-->
<!--      //   { value: 'machinery', label: '农业机械' },-->
<!--      //   { value: 'weather', label: '气象影响' },-->
<!--      //   { value: 'other', label: '其他问题' }-->
<!--      // ]-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    goBack() {-->
<!--      this.$router.go(-1);-->
<!--    },-->
<!--    resetForm() {-->
<!--      this.$refs.questionForm.resetFields();-->
<!--    },-->
<!--    async submitQuestion() {-->
<!--      this.$refs.questionForm.validate(async (valid) => {-->
<!--        if (!valid) return;-->

<!--        this.submitting = true;-->
<!--        try {-->
<!--          const token = this.userStore.token;-->

<!--          const payload = {-->
<!--            title: this.questionForm.title,-->
<!--            content: this.questionForm.content,-->
<!--            // category: this.questionForm.category-->
<!--          };-->
<!--          //改-->
<!--          await axios.post('http://localhost:3000/api/questions', payload, {-->
<!--            headers: {-->
<!--              Authorization: `Bearer ${token}`-->
<!--            }-->
<!--          });-->

<!--          this.$message.success('问题发布成功！');-->
<!--          // 发布成功后跳转到问题列表页-->
<!--          this.$router.push('/farmer/questions');-->
<!--        } catch (error) {-->
<!--          console.error('发布问题失败:', error);-->
<!--          this.$message.error('发布问题失败: ' + (error.response?.data?.message || '未知错误'));-->
<!--        } finally {-->
<!--          this.submitting = false;-->
<!--        }-->
<!--      });-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.post-question-container {-->
<!--  padding: 20px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--.post-question-card {-->
<!--  margin-top: 20px;-->
<!--  //width: 100%;-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--.card-header {-->
<!--  border-bottom: 1px solid #eee;-->
<!--  padding-bottom: 15px;-->
<!--  margin-bottom: 20px;-->
<!--  text-align: center;-->
<!--}-->

<!--.card-header h3 {-->
<!--  margin: 0;-->
<!--  color: #333;-->
<!--}-->

<!--.question-form {-->
<!--  padding: 0 20px;-->
<!--}-->

<!--.form-actions {-->
<!--  display: flex;-->
<!--  justify-content: flex-end;-->
<!--  gap: 15px;-->
<!--  margin-top: 30px;-->
<!--}-->

<!--:deep(.el-page-header__content) {-->
<!--  font-size: 18px;-->
<!--  font-weight: 500;-->
<!--}-->

<!--:deep(.el-form-item__label) {-->
<!--  font-weight: 500;-->
<!--}-->
<!--</style>-->
<template>
  <div class="post-question-container">
    <el-card shadow="hover" class="post-question-card">
      <div class="card-header">
        <h3>填写问题信息</h3>
      </div>

      <el-form
          :model="questionForm"
          :rules="questionRules"
          ref="questionForm"
          label-width="100px"
          class="question-form">

        <el-form-item label="问题标题" prop="title">
          <el-input
              v-model="questionForm.title"
              placeholder="请输入问题标题（例如：如何防治水稻病虫害）"
              maxlength="100"
              show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item label="问题描述" prop="content">
          <el-input
              type="textarea"
              :rows="8"
              placeholder="请详细描述您的问题，包括作物种类、出现的问题、已经采取的措施等"
              v-model="questionForm.content"
              maxlength="1000"
              show-word-limit>
          </el-input>
        </el-form-item>

        <!-- 图片上传区域 -->
        <el-form-item label="问题图片">
          <el-upload
              ref="upload"
              v-model:file-list="fileList"
              :auto-upload="false"
              :multiple="true"
              :limit="5"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              list-type="picture-card">
            <el-icon><Plus /></el-icon>
            <div class="el-upload__text">
              点击上传图片 <br/>
              <span style="font-size: 12px; color: #999;">最多可上传5张图片，每张不超过5MB</span>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="resetForm">重置</el-button>
            <el-button
                type="primary"
                @click="submitQuestion"
                :loading="submitting">
              {{ submitting ? '提交中...' : '提交问题' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/*
用户选择图片文件
       ↓
文件添加到 fileList
       ↓
构造 FormData 对象
       ↓
发送 multipart/form-data 请求
       ↓
后端 multer 接收并保存文件
       ↓
文件保存到服务器磁盘
       ↓
文件信息保存到数据库
       ↓
返回成功响应
*/
import axios from "axios";
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'FarmerPostQuestion',
  components: {
    Plus
  },
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  data() {
    return {
      submitting: false,
      questionForm: {
        title: '',
        content: ''
      },
      fileList: [], // 存储上传的文件列表
      questionRules: {
        title: [
          { required: true, message: '请输入问题标题', trigger: 'blur' },
          { min: 1, max: 100, message: '标题长度应在 1 到 100 个字符之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
          { min: 5, message: '问题描述至少需要 5 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    resetForm() {
      this.$refs.questionForm.resetFields();
      this.fileList = [];
    },
    // 处理超出限制的文件
    handleExceed() {
      ElMessage.warning('最多只能上传5张图片');
    },
    // 处理文件移除
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    async submitQuestion() {
      this.$refs.questionForm.validate(async (valid) => {
        if (!valid) return;

        this.submitting = true;
        try {
          const token = this.userStore.token;

          // 创建 FormData 对象
          const formData = new FormData();
          formData.append('title', this.questionForm.title);
          formData.append('content', this.questionForm.content);

          // 添加图片文件
          if (this.fileList.length > 0) {
            this.fileList.forEach(file => {
              formData.append('images', file.raw);
            });
          }

          // 发送请求
          await axios.post('http://localhost:3000/api/questions', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          ElMessage.success('问题发布成功！');
          // 发布成功后跳转到问题列表页
          this.$router.push('/farmer/questions');
        } catch (error) {
          console.error('发布问题失败:', error);
          ElMessage.error('发布问题失败: ' + (error.response?.data?.message || '未知错误'));
        } finally {
          this.submitting = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.post-question-container {
  padding: 20px;
  margin: 0 auto;
}

.post-question-card {
  margin-top: 20px;
  box-sizing: border-box;
}

.card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
}

.question-form {
  padding: 0 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

:deep(.el-page-header__content) {
  font-size: 18px;
  font-weight: 500;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-upload--picture-card) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
