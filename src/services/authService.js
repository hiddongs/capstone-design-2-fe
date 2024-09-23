import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'; // 백엔드 API 주소

// 네이버 로그인
export function loginWithNaver() {
  return axios.get(`${API_BASE_URL}/login/naver`)
    .then(response => response.data)
    .catch(error => {
      console.error("네이버 로그인 에러:", error);
      throw error;
    });
}

// 카카오 로그인
export function loginWithKakao() {
  return axios.get(`${API_BASE_URL}/login/kakao`)
    .then(response => response.data)
    .catch(error => {
      console.error("카카오 로그인 에러:", error);
      throw error;
    });
}

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
// src/services/authService.js
export function getNaverLoginUrl() {
  const clientId = '네이버 클라이언트 ID';
  const redirectUri = encodeURIComponent('http://localhost:8080/login/callback/naver');
  const state = 'RANDOM_STATE_STRING'; // CSRF 방지를 위한 상태 값
  return `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;
}

export function getKakaoLoginUrl() {
  const clientId = '카카오 클라이언트 ID';
  const redirectUri = encodeURIComponent('http://localhost:8080/login/callback/kakao');
  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
}