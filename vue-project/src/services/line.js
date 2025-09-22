import apiClient from './api.js'

// 공장 목록 조회
export async function fetchFactories() {
    const res = await apiClient.get('/process/routings/factories')
    return res.data
}

// 특정 공장의 차종 목록 조회
export async function fetchCarsByFactory(factoryId) {
    const res = await apiClient.get(`/process/routings/car?factoryId=${factoryId}`)
    return res.data
}

// 특정 차종 라우팅 조회
export async function fetchLineRoutings(carId) {
    const res = await apiClient.get(`/process/routings/${carId}`)
    return res.data
}
