import { get, post } from '../../../utils/api'

// 获取排名
export async function getExpertRank() {
  return await get('/api/expert-rankings')
}

// 获取专家信息
export async function getExpertById(id) {
  return await get('/api/experts/:id', { id })
}

// 获取证书
export async function getMyCertificates() {
  return await get('/api/certificates/my');
}

// 上传证书
export async function uploadCertificate(data) {
  return await post('/api/certificates', data);
}

// 获取所有问题
export async function getAllQuestions() {
  return await get('/api/questions/all')
}

// 提交回答
export async function submitAnswer(data) {
  return await post('/api/answers', data)
}

// 获取最近回答
export async function getRecentAnswers(expertId) {
  return await get(`/api/answers/recent?expert_id=${expertId}`);
}
