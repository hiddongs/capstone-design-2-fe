<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <h2 class="text-center text-2xl font-semibold mb-6 text-gray-700">로그인</h2>
      <div class="space-y-4">
        <!-- 사용자명 입력 -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">사용자명</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="사용자명을 입력하세요"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <!-- 비밀번호 입력 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <!-- 로그인 버튼 -->
        <div class="flex items-center justify-between">
          <button
            @click="login"
            class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            로그인
          </button>
        </div>
        <!-- 회원가입 버튼 -->
        <div class="flex items-center justify-between">
          <button
            @click="goToSignUp"
            class="w-full py-2 px-4 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
          >
            회원가입
          </button>
        </div>
        <!-- 소셜 로그인 -->
        <div class="text-center text-sm text-gray-600 mt-4">
          소셜 로그인
        </div>
        <div class="flex flex-col space-y-2 mt-4">
          <button @click="loginWithNaver" class="w-full py-2 px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition">
            네이버로 로그인
          </button>
          <button @click="loginWithKakao" class="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition">
            카카오로 로그인
          </button>
        </div>
        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '', // 사용자명
      password: '', // 비밀번호
      errorMessage: '', // 에러 메시지
    };
  },
  methods: {
    // 로그인 로직
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          username: this.username,
          password: this.password,
        });

        // 로그인 성공 시 에러 메시지 초기화 및 저장
        this.errorMessage = '';
        alert('로그인 성공!');

        // 로그인 성공 후 응답에서 받은 토큰 및 데이터를 저장
        localStorage.setItem('accessToken', response.data.accessToken);  // AccessToken 저장
        localStorage.setItem('userId', response.data.userId);  // User ID 저장

        // 대시보드로 리디렉션
        this.$router.push('/dashboard');
      } catch (error) {
        // 오류 처리
        if (error.response && error.response.status === 401) {
          // 인증 오류
          this.errorMessage = '사용자명 또는 비밀번호가 잘못되었습니다.';
        } else if (error.response && error.response.status === 404) {
          // 잘못된 경로 또는 자원 없음
          this.errorMessage = '서버에 문제가 발생했습니다. 요청한 페이지를 찾을 수 없습니다.';
        } else {
          // 서버 오류
          this.errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        console.error('로그인 오류:', error);
      }
    },
    
    // 네이버 로그인
    loginWithNaver() {
      window.location.href = 'http://localhost:8080/login/naver'; // 백엔드 네이버 로그인 엔드포인트
    },
    
    // 카카오 로그인
    loginWithKakao() {
      window.location.href = 'http://localhost:8080/login/kakao'; // 백엔드 카카오 로그인 엔드포인트
    },
    
    // 회원가입 페이지로 이동
    goToSignUp() {
      this.$router.push('/signup');
    }
  }
};
</script>