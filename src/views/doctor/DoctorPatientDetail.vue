<template>
  <div class="p-6">

    <!-- 제목 -->
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      👤 환자 상세 정보
    </h1>

    <!-- 로딩 -->
    <div v-if="loading" class="text-gray-500 text-lg">
      불러오는 중입니다...
    </div>

    <!-- 데이터 없음 -->
    <div v-else-if="!patient" class="text-gray-500 text-lg">
      해당 환자 정보를 찾을 수 없습니다.
    </div>

    <!-- 🔥 patient가 있을 때만 전체 렌더링 -->
    <div v-else class="space-y-10">

      <!-- =======================
            1. 기본 정보
      ========================== -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">🧾 기본 정보</h2>

        <p class="text-lg text-gray-700"><strong>이름:</strong> {{ patient.name }}</p>
        <p class="text-lg text-gray-700"><strong>성별:</strong> {{ patient.gender }}</p>
        <p class="text-lg text-gray-700"><strong>생년월일:</strong> {{ formatBirth(patient.birthDate) }}</p>
        <p class="text-lg text-gray-700"><strong>전화번호:</strong> {{ patient.phone }}</p>
      </div>

      <!-- =======================
            2. 문진 기록
      ========================== -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">📝 문진 기록</h2>
        </div>

        <div v-if="triageList.length === 0" class="text-gray-500">
          문진 기록 없음
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in triageList"
            :key="item.id"
            class="p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 cursor-pointer"
            @click="goTriageDetail(item.id)"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-gray-800">
                  {{ item.departmentName }} 문진
                </p>
                <p class="text-gray-600 text-sm mt-1">
                  {{ item.aiSummary ? item.aiSummary.slice(0, 45) + '...' : '요약 없음' }}
                </p>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(item.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================
            3. 예약 기록
      ========================== -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">📅 예약 기록</h2>

        <div v-if="reservations.length === 0" class="text-gray-500">
          예약 기록 없음
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="r in reservations"
            :key="r.id"
            class="p-4 bg-gray-50 rounded-xl border"
          >
            <p class="text-lg font-medium">{{ r.department }}</p>
            <p class="text-gray-700">예약 시간: {{ r.reservedTime }}</p>
            <p class="text-gray-500 text-sm">문진 ID: {{ r.triageId || "없음" }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DoctorPatientDetail",
  props: ["id"],

  data() {
    return {
      patient: null,
      triageList: [],
      reservations: [],
      loading: true,
    };
  },

  async created() {
    await this.fetchPatientDetail();
  },

  methods: {
    async fetchPatientDetail() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const doctorId = user?.id;

        const res = await axios.get(`/api/doctor/${doctorId}/patient/${this.id}`);
        const data = res.data;

        this.patient = data.user || null;
        this.triageList = data.triageList || [];
        this.reservations = data.reservations || [];

      } catch (e) {
        console.error("환자 상세 조회 오류:", e);
        this.patient = null;
      } finally {
        this.loading = false;
      }
    },

    goTriageDetail(triageId) {
      this.$router.push(`/doctor/triage-detail/${triageId}`);
    },

    formatBirth(d) {
      if (!d) return "-";
      return d.split("T")[0];
    },

    formatDate(dt) {
      if (!dt) return "-";
      const d = new Date(dt);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  }
};
</script>

<style scoped></style>
