<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-center text-2xl font-semibold mb-6 text-gray-700">회원가입</h2>
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="이메일을 입력하세요"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">비밀번호 확인</label>
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">{{ confirmPasswordError }}</p>
          </div>
          
          <button
            @click="signUp"
            class="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            회원가입
          </button>
          
          <div v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">
            {{ errorMessage }}
          </div>
          
          <div class="text-center text-sm text-gray-600 mt-4">
            이미 계정이 있으신가요?
            <button @click="goToLogin" class="text-blue-500 underline hover:text-blue-700">로그인</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignUp',
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        errorMessage: '',
      };
    },
    methods: {
      validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      validatePassword(password) {
        
        const minLength = /.{8,}/; //최소 8문자이상
        const hasUpperCase = /[A-Z]/; //대문자 포함
        const hasLowerCase = /[a-z]/; //소문자 포함
        const hasNumber = /\d/; //숫자 포함
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; //특수문자 포함
        return minLength.test(password) && hasUpperCase.test(password) && hasLowerCase.test(password) && hasNumber.test(password) && hasSpecialChar.test(password);
      }, //유효성 검사
      signUp() {
        // 이메일 유효성 검사
        if (!this.validateEmail(this.email)) {
          this.emailError = '유효한 이메일 형식이 아닙니다.';
        } else {
          this.emailError = '';
        }
  
        // 비밀번호 유효성 검사
        if (!this.validatePassword(this.password)) {
          this.passwordError = '비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자 및 특수문자를 포함해야 합니다.';
        } else {
          this.passwordError = '';
        }
  
        // 비밀번호 확인 검사
        if (this.password !== this.confirmPassword) {
          this.confirmPasswordError = '비밀번호가 일치하지 않습니다.';
        } else {
          this.confirmPasswordError = '';
        }
  
        // 검사 성공
        if (!this.emailError && !this.passwordError && !this.confirmPasswordError) {
          // 서버에 회원가입 요청을 보내기
          alert('회원가입 성공! 로그인 페이지로 이동합니다.');
          this.$router.push('/login');
        }
      },
      goToLogin() {
        // 로그인 페이지로 이동
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  /* 스타일링을 위한 CSS */
  </style>