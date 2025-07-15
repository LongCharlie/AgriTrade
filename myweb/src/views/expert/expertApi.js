import { get, post, del, patch } from '../../../utils/api'

// 获取排名
export async function getExpertRank() {
  return await get('/api/expert-rankings')
}

// 获取专家信息
export async function getExpertById(id) {
  return await get('/api/experts/:id', { id })
}

// 获取所有证书
export async function getMyCertificates() {
  return await get('/api/certificates/my');
}

// 上传证书
export async function uploadCertificate(data) {
  return await post('/api/certificates', data);
}

// 删除证书
export async function deleteCertificate(id) {
  return await del(`/api/certificates/${id}`);
}

// 更新证书
export async function updateCertificate(id, updates) {
  return await patch(`/api/certificates/${id}`, updates);
}

// 获取所有问题
export async function getAllQuestions() {
  return await get('/api/questions/all')
}

// 获取单个问题
export async function getQuestionById(id) {
  return await get(`/api/questions/${id}`)
}

// 获取某问题的所有回答，接口未写
export async function getAnswersByQuestionId(id) {
  return await get(`/api/answers/${id}`)
}

// 提交回答
export async function submitAnswer(data) {
  return await post('/api/answers', data)
}

// 获取最近回答
export async function getRecentAnswers(expertId) {
  return await get(`/api/answers/recent?expert_id=${expertId}`);
}

// 更新专家信息
export async function updateExpertProfile(expertId, updates) {
  return await patch('/api/expert/profile', updates);
}

// getAnswerDetail，接口未写
export async function getAnswerById(id) {
  return await get(`/api/answer/${id}`);
}