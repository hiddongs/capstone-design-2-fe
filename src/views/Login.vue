<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <h2 class="text-center text-2xl font-semibold mb-6 text-gray-700">로그인</h2>
      <div class="space-y-4">
        <!-- 이메일 입력 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
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
export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    // 일반 로그인 로직
    async login() {
      if (this.email === 'yhd1227@naver.com' && this.password === '1234') {
        this.errorMessage = '';
        alert('로그인 성공!');
      } else {
        this.errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
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

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 8px;
}
</style>