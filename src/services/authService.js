import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'; // 백엔드 API 주소

// 로그인한 사용자 정보 가져오기
export function getUserInfo() {
  return axios.get(`${API_BASE_URL}/user/info`)
    .then(response => response.data)
    .catch(error => {
      console.error("사용자 정보 가져오기 에러:", error);
      throw error;
    });
}

// 사용자 로그아웃
export function logout() {
  return axios.post(`${API_BASE_URL}/logout`)
    .then(response => response.data)
    .catch(error => {
      console.error("로그아웃 에러:", error);
      throw error;
    });
}

// 회원가입 예시
export function registerUser(userData) {
  return axios.post(`${API_BASE_URL}/register`, userData)
    .then(response => response.data)
    .catch(error => {
      console.error("회원가입 에러:", error);
      throw error;
    });
}

// 로그인 예시
export function loginUser(userData) {
  return axios.post(`${API_BASE_URL}/login`, userData)
    .then(response => response.data)
    .catch(error => {
      console.error("로그인 에러:", error);
      throw error;
    });
}

// 기존 네이버 및 카카오 로그인 관련 코드는 더 이상 필요 없음
// 백엔드에서 리디렉션 처리하므로 해당 메서드 삭제