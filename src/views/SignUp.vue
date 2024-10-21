<template>
  <div class="user-info">
    <h2>사용자 정보</h2>
    <div v-if="user">
      <p><strong>아이디:</strong> {{ user.username }}</p>
      <p><strong>이름:</strong> {{ user.name }}</p>
      <p><strong>전화번호:</strong> {{ user.phone }}</p>
      <button @click="goToEditPage">정보 수정</button>
    </div>
    <div v-else>
      <p>사용자 정보를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null  // 사용자 정보를 저장하는 객체
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    // localStorage에서 사용자 정보를 불러오는 메서드
    getUserInfo() {
      const userInfo = {
        username: localStorage.getItem('username'),
        name: localStorage.getItem('name'),
        phone: localStorage.getItem('phone'),
      };

      if (userInfo.username && userInfo.name && userInfo.phone) {
        this.user = userInfo;  // 사용자 정보를 data에 저장
      } else {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        this.$router.push('/login');
      }
    },
    // 사용자 정보 수정 페이지로 이동하는 메서드
    goToEditPage() {
      this.$router.push('/edit-info');
    }
  }
};
</script>

<style scoped>
.user-info {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.user-info p {
  margin-bottom: 10px;
}
.user-info button {
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.user-info button:hover {
  background-color: #0056b3;
}
</style>