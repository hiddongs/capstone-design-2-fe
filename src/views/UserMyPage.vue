<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-sky-600">마이페이지</h1>

    <!-- 👤 기본 정보 -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-semibold mb-4">👤 기본 정보</h2>

      <div class="grid grid-cols-2 gap-4 text-gray-700">

        <div>
          <p class="text-sm text-gray-500">이름</p>
          <p class="text-lg font-semibold">{{ user.name }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">성별</p>
          <p class="text-lg">{{ user.gender }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">생년월일</p>
          <p class="text-lg">{{ formatDate(user.birthDate) }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">역할</p>
          <p
            class="text-lg font-bold"
            :class="user.role === 'DOCTOR' ? 'text-green-600' : 'text-blue-600'"
          >
            {{ user.role }}
          </p>
        </div>
      </div>
    </div>

  

    <!-- 🔔 알림 · 공지사항 -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-semibold mb-4">🔔 내 알림 · 공지사항</h2>

      <div v-if="user.notifications?.length > 0">
        <ul class="space-y-3">
          <li
            v-for="n in user.notifications"
            :key="n.id"
            class="p-4 border rounded-lg bg-gray-50"
          >
            <p class="font-semibold text-sky-700">{{ n.title }}</p>
            <p class="text-sm">{{ n.message }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDateTime(n.date) }}</p>
          </li>
        </ul>
      </div>

      <p v-else class="text-gray-500">새로운 알림이 없습니다.</p>
    </div>

    <!-- ⚙️ 계정 설정 -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-semibold mb-3">⚙️ 계정 설정</h2>

      <button
        class="text-sky-600 font-semibold underline hover:text-sky-700"
        @click="goToSettings"
      >
        계정 설정 페이지 →
      </button>

      <button
        class="block mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        @click="logout"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserMyPage",

  data() {
    return {
      user: {},
    };
  },

  created() {
    this.fetchUser();
  },

  methods: {
    async fetchUser() {
      try {
        const userId = localStorage.getItem("userId");

        const response = await fetch(`http://localhost:8080/api/auth/mypage/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");

        this.user = await response.json();

        // ⭐ 임시 알림 데이터 추가
        this.user.notifications = [
          {
            id: 1,
            title: "📢 서비스 점검 안내",
            message: "보다 안정적인 서비스를 위해 11월 25일 02:00~04:00 서버 점검이 예정되어 있습니다.",
            date: "2025-11-18T10:30:00"
          },
          {
            id: 2,
            title: "🩺 비대면 진료 기능 업데이트",
            message: "화상 진료 품질이 향상되었습니다. 더 빠르고 안정적인 연결을 제공합니다.",
            date: "2025-11-17T08:20:00"
          },
          {
            id: 3,
            title: "🔐 계정 보안 강화",
            message: "최근 보안 정책이 강화되었습니다. 비밀번호를 6개월마다 변경하길 권장드립니다.",
            date: "2025-11-15T21:10:00"
          }
        ];

      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    },

    goToSettings() {
      this.$router.push("/dashboard/settings");
    },

    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped></style>
