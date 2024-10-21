<template>
    <div class="user-info-page">
      <h2>사용자 정보</h2>
      <p><strong>아이디:</strong> {{ username }}</p>
      <p><strong>이름:</strong> {{ name }}</p>
      <p><strong>전화번호:</strong> {{ phone }}</p>
      <button @click="logout">로그아웃</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        name: '',
        phone: '',
      };
    },
    mounted() {
      // 로그인된 사용자 정보를 localStorage에서 불러옴
      this.username = localStorage.getItem('username');
      this.name = localStorage.getItem('name');
      this.phone = localStorage.getItem('phone');
  
      console.log('Username:', this.username);
  console.log('Name:', this.name);
  console.log('Phone:', this.phone);
      // 만약 로그인되지 않은 상태라면 로그인 페이지로 리다이렉트
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        this.$router.push('/login');
      }
    },
    methods: {
      logout() {
        // 로그아웃 시 localStorage에서 정보 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('phone');
        alert('로그아웃되었습니다.');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .user-info-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  </style>