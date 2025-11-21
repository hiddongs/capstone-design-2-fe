<template>
  <div class="p-6">

    <!-- 제목 -->
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      👥 환자 목록
    </h1>

    <!-- 로딩 -->
    <div v-if="loading" class="text-gray-500 text-lg">
      불러오는 중입니다...
    </div>

    <!-- 환자 없음 -->
    <div v-if="!loading && patients.length === 0" class="text-gray-500 text-lg">
      아직 문진을 제출한 환자가 없습니다.
    </div>

    <!-- 환자 리스트 -->
    <div v-else class="space-y-4">

      <div
        v-for="p in patients"
        :key="p.userId"
        class="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 transition cursor-pointer"
        @click="openPatient(p.userId)"
      >
        <div class="flex justify-between items-center">

          <!-- 왼쪽: 기본 정보 -->
          <div>
            <p class="text-xl font-semibold text-gray-800">
              👤 환자 ID: {{ p.userId }}
            </p>

            <p class="text-gray-600 mt-1">
              📝 제출한 문진 수: <strong>{{ p.triageCount }}</strong>
            </p>

            <p class="text-gray-600">
              ⏱ 최근 문진일: <strong>{{ formatDate(p.lastTriageDate) }}</strong>
            </p>
          </div>

          <!-- 오른쪽: 이동 버튼 -->
          <div>
            <button
              @click.stop="openPatient(p.userId)"
              class="bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 transition"
            >
              상세 보기 →
            </button>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DoctorPatientList",

  data() {
    return {
      doctorId: null,
      triageList: [],
      patients: [],
      loading: true,
    };
  },

  async created() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.doctorId = user?.id;

    if (!this.doctorId) return;

    await this.fetchTriage();
    this.processPatients();
  },

  methods: {
    async fetchTriage() {
      try {
        const res = await axios.get(`/api/doctor/${this.doctorId}/triage`);
        this.triageList = res.data;
      } catch (e) {
        console.error("문진 목록 불러오기 오류:", e);
      } finally {
        this.loading = false;
      }
    },

    processPatients() {
      const grouped = {};

      this.triageList.forEach(t => {
        const userId = t.userId;

        if (!grouped[userId]) {
          grouped[userId] = {
            userId,
            triageCount: 0,
            lastTriageDate: null
          };
        }

        grouped[userId].triageCount++;

        // 가장 최근 문진 날짜 저장
        const created = new Date(t.createdAt);
        if (!grouped[userId].lastTriageDate || created > grouped[userId].lastTriageDate) {
          grouped[userId].lastTriageDate = created;
        }
      });

      this.patients = Object.values(grouped);
    },

    openPatient(userId) {
      this.$router.push(`/doctor/patient/${userId}`);
    },

    formatDate(dt) {
      if (!dt) return "-";
      const d = new Date(dt);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
  }
};
</script>

<style scoped>
</style>
