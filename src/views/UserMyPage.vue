<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-sky-600">마이페이지</h1>

    <!-- User Profile Card -->
    <div class="bg-white rounded-xl shadow p-6 flex items-center space-x-6">
      <img
        src="https://via.placeholder.com/120"
        alt="프로필 사진"
        class="w-24 h-24 rounded-full object-cover shadow"
      />

      <div>
        <h2 class="text-2xl font-bold">{{ user.name }}</h2>

        <div class="mt-2 text-sm text-gray-700">
          <p>성별: {{ user.gender }}</p>
          <p>생년월일: {{ formatDate(user.birthDate) }}</p>
          <p>
            역할:
            <span
              :class="user.role === 'DOCTOR' ? 'text-green-600 font-bold' : 'text-blue-600 font-bold'"
            >
              {{ user.role }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Disease History -->
    <div class="bg-white rounded-xl shadow p-6 mt-6">
      <h3 class="text-xl font-semibold mb-3">📄 질병 내역</h3>

      <div v-if="user.diseaseHistories && user.diseaseHistories.length > 0">
        <ul class="space-y-2">
          <li
            v-for="d in user.diseaseHistories"
            :key="d.id"
            class="p-3 border rounded-lg bg-gray-50"
          >
            <p class="font-semibold">{{ d.diseaseName }}</p>
            <p>발병일: {{ d.dateOnOnset }}</p>
            <p>완치 여부: {{ d.completeCureOrNot }}</p>
          </li>
        </ul>
      </div>

      <p v-else class="text-gray-700">등록된 질병 이력이 없습니다.</p>
    </div>

    <!-- Doctor Request Section -->
    <div class="bg-white rounded-xl shadow p-6 mt-6">
      <h3 class="text-xl font-semibold mb-3">👨‍⚕️ 의사 전환 신청</h3>

      <p v-if="user.role === 'DOCTOR'" class="text-green-600 font-bold">
        이미 의사 계정입니다.
      </p>

      <button
        v-else
        class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
        @click="goToDoctorRequest"
      >
        자격증 제출하고 의사 전환하기 →
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyPage",

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
      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    goToDoctorRequest() {
      this.$router.push("/dashboard/doctor-apply");
    },
  },
};
</script>

<style scoped></style>
