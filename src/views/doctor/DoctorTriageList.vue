<template>
  <div class="p-6">

    <!-- 제목 -->
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      📝 문진 요청 목록
    </h1>

    <!-- 로딩 -->
    <div v-if="loading" class="text-gray-500 text-lg">불러오는 중...</div>

    <!-- 문진 없음 -->
    <div v-if="!loading && triageList.length === 0" class="text-gray-500 text-lg">
      현재 문진 요청이 없습니다.
    </div>

    <!-- 문진 리스트 -->
    <div v-else class="space-y-4">
      <div
        v-for="item in triageList"
        :key="item.id"
        class="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 transition cursor-pointer"
        @click="openDetail(item.id)"
      >

        <div class="flex justify-between items-center">
          
          <!-- 왼쪽 텍스트 -->
          <div>
            <p class="text-xl font-semibold text-gray-800">
              {{ item.departmentName }} 문진
            </p>

            <p class="text-gray-600 mt-1">
              👤 환자 ID: {{ item.userId }}
            </p>

            <p class="text-gray-700 mt-2">
              {{ item.aiSummary ? item.aiSummary.slice(0, 60) + "..." : "요약 없음" }}
            </p>
          </div>

          <!-- 오른쪽 날짜 -->
          <div class="text-sm text-gray-500">
            {{ formatDate(item.createdAt) }}
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DoctorTriageList",

  data() {
    return {
      doctorId: null,
      triageList: [],
      loading: true,
    };
  },

  async created() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.doctorId = user?.id;

    if (!this.doctorId) return;

    await this.fetchTriageList();
  },

  methods: {
    async fetchTriageList() {
      try {
        const res = await axios.get(`/api/doctor/${this.doctorId}/triage`);
        this.triageList = res.data;
      } catch (error) {
        console.error("문진 불러오기 오류:", error);
      } finally {
        this.loading = false;
      }
    },

    openDetail(id) {
      // 의사용 triage detail 페이지 경로 (아직 없으면 다음에 만들어줄게)
      this.$router.push(`/doctor/triage-detail/${id}`);
    },

    formatDate(dt) {
      if (!dt) return '';
      const date = new Date(dt);
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    },
  },
};
</script>

<style scoped>
</style>
