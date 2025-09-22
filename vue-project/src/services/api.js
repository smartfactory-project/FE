import axios from 'axios'

// 백엔드 서버 주소
const API_BASE_URL = 'http://localhost:8081'
// const API_BASE_URL = 'https://4f5ee791-ebb0-4db3-a345-fb3afa22ab4d.mock.pstmn.io/'
// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,//import.meta.env.VITE_API_BASE_URL
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10초 타임아웃
})

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 현재 페이지가 로그인 페이지가 아니라면 로그인 페이지로 이동
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// 인증 관련 API
export const authAPI = {
  // 회원가입
  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/register', userData)
      
      // 회원가입 성공 시 토큰과 사용자 정보 저장
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        }))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: '회원가입에 실패했습니다.' }
    }
  },

  // 로그인
  login: async (loginData) => {
    try {
      const response = await apiClient.post('/api/auth/login', loginData)
      
      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        }))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: '로그인에 실패했습니다.' }
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // 로그인 상태 확인
  isLoggedIn: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  // 헬스 체크
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/api/auth/health')
      return response.data
    } catch (error) {
      throw error.response?.data || { error: '서버에 연결할 수 없습니다.' }
    }
  }
}

// 기본 API 클라이언트 내보내기
export default apiClient