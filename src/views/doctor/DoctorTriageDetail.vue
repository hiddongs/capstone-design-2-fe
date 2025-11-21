<template>
  <div class="p-6">

    <h1 class="text-3xl font-bold text-sky-600 mb-6">📝 문진 상세 정보</h1>

    <!-- 로딩 -->
    <div v-if="loading" class="text-gray-600 text-lg">
      불러오는 중입니다...
    </div>

    <!-- 데이터 없음 -->
    <div v-else-if="!triage" class="text-gray-500 text-lg">
      문진 정보를 불러올 수 없습니다.
    </div>

    <!-- 문진 상세 -->
    <div v-else class="space-y-6">

      <!-- 기본 정보 -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">기본 정보</h2>
        <p class="text-lg text-gray-700"><strong>환자 ID:</strong> {{ triage.userId }}</p>
        <p class="text-lg text-gray-700"><strong>진료과:</strong> {{ triage.departmentName }} ({{ triage.department }})</p>
        <p class="text-lg text-gray-700"><strong>작성일:</strong> {{ formatDate(triage.createdAt) }}</p>

        <button
          @click="goPatient(triage.userId)"
          class="mt-4 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
        >
          👤 환자 상세 정보 보기
        </button>
      </div>

      <!-- AI 요약 -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">🤖 AI 요약</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {{ triage.aiSummary || "요약 정보 없음" }}
        </p>
      </div>

      <!-- 📋 문진 상세 -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-3">📋 문진 상세</h2>

        <div v-if="questionList.length === 0" class="text-gray-500">
          문진 상세 정보 없음
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(q, index) in questionList"
            :key="index"
            class="p-4 rounded-xl border bg-gray-50"
          >
            <p class="font-semibold text-gray-800">• {{ q.question }}</p>
            <p class="text-gray-700 mt-1">👉 {{ q.answer }}</p>
          </div>
        </div>
      </div>

      <!-- 예약 버튼 -->
      <div class="mt-8">
        <button
          class="bg-sky-600 text-white py-3 px-6 rounded-xl text-lg hover:bg-sky-700 transition"
          @click="goReservation(triage.id)"
        >
          📅 이 문진으로 예약 관리하기
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DoctorTriageDetail",
  props: ["triageId"],

  data() {
    return {
      triage: null,
      questionList: [],
      loading: true,
    };
  },

  async created() {
    await this.fetchDetail();
  },

  methods: {
    async fetchDetail() {
      try {
        const res = await axios.get(`/api/triage/${this.triageId}`);
        this.triage = res.data;

        // 🔥 detailJson → 배열 변환
        if (this.triage.detailJson) {
          this.questionList = JSON.parse(this.triage.detailJson);
        }

      } catch (error) {
        console.error("문진 상세조회 오류:", error);
      } finally {
        this.loading = false;
      }
    },

    formatDate(dt) {
      if (!dt) return "";
      const d = new Date(dt);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    },

    goPatient(userId) {
      this.$router.push(`/doctor/patient/${userId}`);
    },

    goReservation(triageId) {
      this.$router.push(`/doctor/reservations?triageId=${triageId}`);
    },
  },
};
</script>

<style scoped></style>
