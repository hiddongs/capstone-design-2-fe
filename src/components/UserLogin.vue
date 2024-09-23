<template>
    <div>
      <div>
        <h2>Please Log In</h2>
        <div id="loginForm">
          <form @submit.prevent="fnLogin">
            <p>
              <label for="uid">ID</label>
              <input id="uid" class="w3-input" placeholder="Enter your ID" v-model="user_id"><br>
            </p>
            <p>
              <label for="password">Password</label>
              <input id="password" name="password" class="w3-input" placeholder="Enter your password" v-model="user_pw" type="password">
            </p>
            <p>
              <button type="submit" class="w3-button w3-green w3-round">Login</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserLogin',
    data() {
      return {
        user_id: '',
        user_pw: ''
      }
    },
    methods: {
      async fnLogin() {
        if (this.user_id === '') {
          alert('ID를 입력하세요.');
          return;
        }
  
        if (this.user_pw === '') {
          alert('비밀번호를 입력하세요.');
          return;
        }
  
        try {
          const response = await axios.post('/api/login', {
            user_id: this.user_id,
            user_pw: this.user_pw
          });
  
          if (response.data.success) {
            alert('로그인 되었습니다.');
            // 로그인 성공 시 추가 로직
          } else {
            alert('로그인 실패: ' + response.data.message);
          }
        } catch (error) {
          console.error(error);
          alert('로그인 중 오류가 발생했습니다.');
        }
      }
    }
  }
  </script>
  
  <style>
  #loginForm {
    width: 500px;
    margin: auto;
  }
  </style>