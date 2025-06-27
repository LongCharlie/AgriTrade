import { get } from '../../../utils/api'

export async function getExpertRank() {
  return await get('/api/expert-rankings')
}

export async function getExpertById(id) {
  return await get('/api/experts/:id', { id })
}