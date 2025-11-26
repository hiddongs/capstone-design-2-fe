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
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <!-- 로그인 버튼 -->
        <div>
          <button
            @click="login"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            로그인
          </button>
        </div>

        <!-- 회원가입 버튼 -->
        <div>
          <button
            @click="goToSignUp"
            class="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            회원가입
          </button>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">
          {{ errorMessage }}
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",

  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },

  methods: {
    async login() {
      //  보내는 데이터를 먼저 확인
      const loginData = {
        username: this.username,
        password: this.password,
      };

      console.log("📤 로그인 요청 데이터:", loginData);

      try {
        const response = await axios.post("http://localhost:8080/api/auth/login", loginData);

        console.log("✅ 로그인 성공 데이터:", response.data);

        alert("로그인 성공!");

        // AccessToken & user 정보 저장
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", this.username);
        localStorage.setItem("role", response.data.role);
localStorage.setItem("userId", response.data.userId); 
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.userId,
            username: this.username,
            role: response.data.role,
          })
        );

        this.$router.push("/");

      } catch (error) {
        console.log("❌ 로그인 실패:", error.response?.data);
        console.log("❌ 상태코드:", error.response?.status);

        if (error.response?.status === 401) {
          this.errorMessage = "사용자명 또는 비밀번호가 잘못되었습니다.";
        } else {
          this.errorMessage = "서버 오류가 발생했습니다.";
        }
      }
    },

    goToSignUp() {
      this.$router.push("/signup");
    },
  },
};
</script>
