<template>
  <div class="p-6">

    <!-- ⭐ 의사 환영 메시지 -->
    <div class="bg-sky-50 border border-sky-200 shadow-sm p-6 rounded-xl mb-8">
      <h2 class="text-2xl font-bold text-sky-700 mb-2">
        {{ doctorName }} 선생님, 안녕하세요 👋
      </h2>
      <p class="text-gray-700 text-lg">
        항상 환자분들을 위해 힘써주셔서 감사합니다.
        <br />
        오늘도 편안하고 안전한 진료를 위해 대시보드를 준비해두었어요.
      </p>
    </div>

    <!-- 기존 페이지 제목 -->
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      👨‍⚕️ 의사 대시보드
    </h1>

    <!-- 상단 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div class="text-xl font-semibold text-gray-700 mb-2">오늘 예약</div>
        <div class="text-4xl font-extrabold text-sky-600">{{ reservationCount }}</div>
      </div>

      <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div class="text-xl font-semibold text-gray-700 mb-2">문진 요청</div>
        <div class="text-4xl font-extrabold text-sky-600">{{ triageCount }}</div>
      </div>

      <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div class="text-xl font-semibold text-gray-700 mb-2">담당 환자</div>
        <div class="text-4xl font-extrabold text-sky-600">{{ patientCount }}</div>
      </div>
    </div>

    <!-- 최근 문진 요청 -->
    <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">📋 최근 문진 요청</h2>

        <router-link
          to="/doctor/triage"
          class="text-sky-600 hover:underline font-semibold"
        >
          전체보기 →
        </router-link>
      </div>

      <div v-if="recentTriage.length === 0" class="text-gray-500">
        최근 문진 요청이 없습니다.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in recentTriage"
          :key="item.id"
          class="p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 cursor-pointer"
          @click="goTriageDetail(item.id)"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-bold text-gray-800">
                {{ item.departmentName }} 문진 요청
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ item.aiSummary ? item.aiSummary.slice(0, 40) + '...' : '요약 없음' }}
              </p>
            </div>

            <div class="text-sm text-gray-500">
              {{ formatDate(item.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⭐ 새로 추가한 “답변 필요한 질문” 섹션 -->
    <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100 mt-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">💬 답변이 필요한 질문</h2>

        <router-link
          to="/doctor/unanswered"
          class="text-sky-600 hover:underline font-semibold"
        >
          전체보기 →
        </router-link>
      </div>

      <div v-if="unansweredBoards.length === 0" class="text-gray-500">
        현재 답변 대기 중인 질문이 없습니다.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="b in unansweredBoards"
          :key="b.id"
          class="p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 cursor-pointer"
          @click="openBoard(b.id)"
        >
          <p class="font-bold text-gray-800">{{ b.title }}</p>
          <p class="text-sm text-gray-600 mt-1">
            🏥 {{ b.department }} · {{ b.symptom }}
          </p>
        </div>
      </div>
    </div>

    <!-- 빠른 이동 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      <router-link
        to="/doctor/reservations"
        class="block text-center bg-sky-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-sky-600 transition"
      >
        📅 예약 관리
      </router-link>

      <router-link
        to="/doctor/triage"
        class="block text-center bg-sky-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-sky-600 transition"
      >
        📝 문진 요청 보기
      </router-link>

      <router-link
        to="/doctor/patients"
        class="block text-center bg-sky-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-sky-600 transition"
      >
        👥 환자 목록
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DoctorDashboard",

  data() {
    return {
      doctorId: null,
      doctorName: "",

      reservationCount: 0,
      triageCount: 0,
      patientCount: 0,

      recentTriage: [],
      unansweredBoards: [] // ⭐ 추가
    };
  },

  async created() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.doctorId = user?.id;
    this.doctorName = user?.name || "의사";

    if (!this.doctorId) return;

    await this.fetchCounts();
    await this.fetchRecentTriage();
    await this.fetchUnansweredBoards(); // ⭐ 추가
  },

  methods: {
    async fetchCounts() {
      try {
        const reservations = await axios.get(`/api/doctor/${this.doctorId}/reservations`);
        this.reservationCount = reservations.data.length;

        const triageList = await axios.get(`/api/doctor/${this.doctorId}/triage`);
        this.triageCount = triageList.data.length;

        const uniqueUsers = new Set(triageList.data.map(t => t.userId));
        this.patientCount = uniqueUsers.size;

      } catch (error) {
        console.error("DoctorDashboard fetchCounts error:", error);
      }
    },

    async fetchRecentTriage() {
      try {
        const triageList = await axios.get(`/api/doctor/${this.doctorId}/triage`);
        this.recentTriage = triageList.data.slice(0, 5);

      } catch (error) {
        console.error("fetchRecentTriage error:", error);
      }
    },

    async fetchUnansweredBoards() {
      try {
        const res = await axios.get(`/api/doctor/${this.doctorId}/unanswered-boards`);
        this.unansweredBoards = res.data;
      } catch (e) {
        console.error("Unanswered boards error:", e);
      }
    },

    goTriageDetail(id) {
      this.$router.push(`/doctor/triage-detail/${id}`);
    },

    openBoard(boardId) {
      this.$router.push(`/doctor/board/${boardId}`);
    },

    formatDate(dt) {
      if (!dt) return '';
      const date = new Date(dt);
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
  }
};
</script>

<style scoped></style>
