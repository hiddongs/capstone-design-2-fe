<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-sky-600 mb-6">계정 설정</h1>

    <!-- 🔐 비밀번호 변경 -->
    <div class="bg-white rounded-xl shadow p-6 space-y-5">
      <h2 class="text-xl font-semibold mb-3">🔐 비밀번호 변경</h2>

      <div>
        <label class="text-sm text-gray-500">현재 비밀번호</label>
        <input
          v-model="form.currentPassword"
          type="password"
          class="border rounded-lg p-2 w-full mt-1"
          placeholder="현재 비밀번호"
        />
      </div>

      <div>
        <label class="text-sm text-gray-500">새 비밀번호</label>
        <input
          v-model="form.newPassword"
          type="password"
          class="border rounded-lg p-2 w-full mt-1"
          placeholder="새 비밀번호"
        />
      </div>

      <div>
        <label class="text-sm text-gray-500">새 비밀번호 확인</label>
        <input
          v-model="form.newPasswordConfirm"
          type="password"
          class="border rounded-lg p-2 w-full mt-1"
          placeholder="새 비밀번호 확인"
        />
      </div>

      <button
        @click="changePassword"
        class="w-full bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
      >
        비밀번호 변경하기
      </button>
    </div>

    <button
      class="mt-4 text-gray-600 underline"
      @click="$router.push('/dashboard/mypage')"
    >
      ← 마이페이지로 돌아가기
    </button>
  </div>
</template>

<script>
export default {
  name: "UserSettings",

  data() {
    return {
      form: {
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      },
    };
  },

  methods: {
    async changePassword() {
      if (!this.form.currentPassword || !this.form.newPassword) {
        alert("모든 입력란을 입력해주세요.");
        return;
      }

      if (this.form.newPassword !== this.form.newPasswordConfirm) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }

      alert("비밀번호 변경 API 연동 예정");
    },
  },
};
</script>

<style scoped></style>
