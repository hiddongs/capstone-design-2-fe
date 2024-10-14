<template>
    <div class="signup-form">
      <h2>회원가입</h2>
      <form @submit.prevent="signUp">
        <div>
          <label for="username">아이디:</label>
          <input type="username" v-model="username" id="username" />
          <span v-if="emailError">{{ emailError }}</span>
        </div>
  
        <div>
          <label for="name">이름:</label>
          <input type="text" v-model="name" id="name" />
        </div>

        <div>
          <label for="phone">전화번호:</label>
          <input type="text" v-model="phone" id="phone" />
        </div>
  
        <div>
          <label for="password">비밀번호:</label>
          <input type="password" v-model="password" id="password" />
          <span v-if="passwordError">{{ passwordError }}</span>
        </div>
  
        <div>
          <label for="confirmPassword">비밀번호 확인:</label>
          <input type="password" v-model="confirmPassword" id="confirmPassword" />
          <span v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
        </div>
  
        <button type="submit">회원가입</button>
        <button type="button" @click="goToLogin">로그인 페이지로 이동</button>
      </form>
    </div>
  </template>

<script>
import axios from 'axios';

export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    };
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },
    validatePassword(password) {
      const minLength = /.{8,}/;
      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasNumber = /\d/;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
      return (
        minLength.test(password) &&
        hasUpperCase.test(password) &&
        hasLowerCase.test(password) &&
        hasNumber.test(password) &&
        hasSpecialChar.test(password)
      );
    },
    async signUp() {
      // 이메일 유효성 검사
      if (!this.validateEmail(this.username)) {
        this.emailError = '유효한 이메일 형식이 아닙니다.';
      } else {
        this.emailError = '';
      }

      // 비밀번호 유효성 검사
      if (!this.validatePassword(this.password)) {
        this.passwordError =
          '비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자 및 특수문자를 포함해야 합니다.';
      } else {
        this.passwordError = '';
      }

      // 비밀번호 확인 검사
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = '비밀번호가 일치하지 않습니다.';
      } else {
        this.confirmPasswordError = '';
      }

      // 모든 검사 통과 후 서버로 데이터 전송
      if (!this.emailError && !this.passwordError && !this.confirmPasswordError) {
        try {
          const signupData = {
            username: this.username,
            password: this.password,
            name: this.name,
            
            phone: this.phone,
          };

          // 백엔드로 회원가입 데이터 전송
          const response = await axios.post('http://localhost:8080/api/auth/signup', signupData);

          // 회원가입 성공 후 토큰을 localStorage에 저장
          if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('userId', response.data.userId);  // 유저 ID도 저장 가능
          }

          alert('회원가입 성공! 로그인 페이지로 이동합니다.');
          this.$router.push('/login');
        } catch (error) {
          console.error('회원가입 실패:', error.response.data);
          this.errorMessage = '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>
  
  <style scoped>
  .signup-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  .signup-form div {
    margin-bottom: 10px;
  }
  .signup-form label {
    display: block;
    margin-bottom: 5px;
  }
  .signup-form input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .signup-form button {
    margin-right: 10px;
  }
  </style>