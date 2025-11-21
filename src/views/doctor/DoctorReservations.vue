<template>
  <div class="p-6">

    <!-- 제목 -->
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      📅 진료 예약 목록
    </h1>

    <!-- 예약 없음 -->
    <div v-if="reservations.length === 0" class="text-gray-500 text-lg">
      현재 등록된 예약이 없습니다.
    </div>

    <!-- 예약 리스트 -->
    <div class="space-y-4" v-else>

      <div
        v-for="item in reservations"
        :key="item.id"
        class="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 transition cursor-pointer"
      >
        <div class="flex justify-between items-center">

          <!-- 왼쪽: 환자 정보 -->
          <div>
            <p class="text-xl font-semibold text-gray-800">
              👤 환자 ID: {{ item.userId }}
            </p>

            <p class="text-gray-600 mt-1">
              🏥 진료과: {{ item.department }}
            </p>

            <p class="text-gray-600">
              📝 문진 ID:
              <span v-if="item.triageId" class="text-blue-600 font-semibold">
                {{ item.triageId }}
              </span>
              <span v-else class="text-gray-400">
                없음
              </span>
            </p>
          </div>

          <!-- 오른쪽: 시간 + 버튼 -->
          <div class="text-right">
            <p class="text-lg font-semibold text-sky-600">
              ⏱ {{ formatTime(item.reservedTime) }}
            </p>

            <button
              v-if="item.triageId"
              @click="openTriage(item.triageId)"
              class="mt-3 bg-sky-500 text-white py-2 px-4 rounded-xl hover:bg-sky-600 transition"
            >
              문진 보기
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
  name: "DoctorReservations",

  data() {
    return {
      doctorId: null,
      reservations: []
    };
  },

  async created() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.doctorId = user?.id;

    if (!this.doctorId) return;

    await this.fetchReservations();
  },

  methods: {
    async fetchReservations() {
      try {
        const res = await axios.get(`/api/doctor/${this.doctorId}/reservations`);
        this.reservations = res.data;
      } catch (error) {
        console.error("예약 불러오기 오류:", error);
      }
    },

    openTriage(triageId) {
      this.$router.push(`/doctor/triage-detail/${triageId}`);
    },

    formatTime(t) {
      if (!t) return "";
      if (t.includes("T")) return t.split("T")[1].slice(0, 5);
      return t;
    },
  },
};
</script>

<style scoped>
</style>
