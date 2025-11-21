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
        <div class="flex items-center justify-between">
          <button
            @click="login"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            로그인
          </button>
        </div>

        <!-- 회원가입 버튼 -->
        <div class="flex items-center justify-between">
          <button
            @click="goToSignUp"
            class="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            회원가입
          </button>
        </div>

        <!-- 소셜 로그인 -->
        <div class="text-center text-sm text-gray-600 mt-4">
          소셜 로그인
        </div>

        <div class="flex flex-col space-y-2 mt-4">
          <button @click="loginWithNaver" class="w-full py-2 px-4 bg-green-500 text-white rounded-md">
            네이버로 로그인
          </button>
          <button @click="loginWithKakao" class="w-full py-2 px-4 bg-yellow-500 text-white rounded-md">
            카카오로 로그인
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
      console.log("🔥 입력된 username:", this.username);
      console.log("🔥 입력된 password:", this.password);

      try {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
          username: this.username,
          password: this.password,
        });

        console.log("🔥 서버 응답:", response.data);

        this.errorMessage = "";
        alert("로그인 성공!");

        // AccessToken & user 정보 저장
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", this.username);
        localStorage.setItem("role", response.data.role);

        // user 전체 객체 저장 (Doctor Layout 라우팅용)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.userId,
            username: this.username,
            role: response.data.role, // ROLE_DOCTOR 또는 ROLE_USER
          })
        );

        // 🔥 역할 기반 라우팅
        if (response.data.role === "ROLE_DOCTOR") {
          console.log("🔵 의사 계정 로그인 → /doctor/dashboard 이동");
          this.$router.push("/doctor/dashboard");
        } else {
          console.log("🟢 일반 사용자 로그인 → /dashboard 이동");
          this.$router.push("/dashboard");
        }

      } catch (error) {
        console.log("❌ 서버 오류 전체:", error);
        console.log("❌ 서버 오류 응답:", error.response);

        if (error.response?.status === 401) {
          this.errorMessage = "사용자명 또는 비밀번호가 잘못되었습니다.";
        } else if (error.response?.status === 404) {
          this.errorMessage = "서버 문제: 요청한 페이지를 찾을 수 없습니다.";
        } else {
          this.errorMessage = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
      }
    },

    loginWithNaver() {
      window.location.href = "http://localhost:8080/login/naver";
    },

    loginWithKakao() {
      window.location.href = "http://localhost:8080/login/kakao";
    },

    goToSignUp() {
      this.$router.push("/signup");
    },
  },
};
</script>
