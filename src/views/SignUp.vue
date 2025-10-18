<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <h2 class="text-center text-2xl font-semibold mb-6 text-gray-700">회원가입</h2>

      <form @submit.prevent="signUp" class="space-y-4">
        <!-- 아이디 -->
        <input
          v-model="username"
          type="text"
          placeholder="아이디"
          class="input-box"
          required
        />

        <!-- 비밀번호 -->
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호"
          class="input-box"
          required
        />

        <!-- 이름 -->
        <input
          v-model="name"
          type="text"
          placeholder="이름"
          class="input-box"
          required
        />

        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
        전화번호
        </label>
        <input
           v-model="phone"
           type="text"
           id="phone"
           maxlength="12"
           pattern="[0-9]{10,12}"
           placeholder="예: 01012345678"
           required
           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <p class="text-xs text-gray-500 mt-1">숫자만 입력해주세요 (예: 01012345678)</p>
        <!-- 생년월일 -->
        <div>
          <label
            for="birthDate"
            class="block text-sm font-medium text-gray-700 mb-1"
            >생년월일</label
          >
          <input
            v-model="birthDate"
            type="date"
            id="birthDate"
            :max="today" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <!-- 성별 -->
        <select v-model="gender" class="input-box" required>
          <option value="">성별 선택</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>

        <!-- 회원가입 버튼 -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none transition"
        >
          회원가입
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        이미 계정이 있으신가요?
        <router-link to="/login" class="text-blue-600 hover:underline">
          로그인하기
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      password: "",
      name: "",
      phone: "",
      birthDate: "",
      gender: "",
      today: new Date().toISOString().split("T")[0], // ✅ 오늘 날짜 (YYYY-MM-DD)
    };
  },
  methods: {
    async signUp() {
      // ✅ 생년월일이 미래면 차단
      if (new Date(this.birthDate) > new Date()) {
        alert("생년월일은 오늘 이후일 수 없습니다.");
        return;
      }

      try {
        await axios.post("http://localhost:8080/api/auth/signup", {
          username: this.username,
          password: this.password,
          name: this.name,
          phone: this.phone,
          birthDate: this.birthDate,
          gender: this.gender,
        });

        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        this.$router.push("/login");
      } catch (error) {
        console.error("회원가입 오류:", error);
        alert("회원가입 실패! 다시 시도해주세요.");
         if (error.response && error.response.status === 409) {
          alert(error.response.data); // 예: "이미 사용 중인 아이디입니다."
         } else {
          alert("회원가입 실패! 다시 시도해주세요.");
         }
      }
    },
  },
};
</script>

<style scoped>
.input-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}
.input-box:focus {
  border-color: #2563eb;
}
</style>
