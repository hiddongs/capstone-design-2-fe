<template>
  <div class="max-w-3xl mx-auto py-10">

    <h2 class="text-3xl font-bold mb-6">👨‍⚕️ 의사 선택</h2>
    <p class="text-gray-600 mb-4">{{ selectedDept }} 전문의를 선택하세요.</p>

    <!-- 카테고리 버튼 -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="dept in deptList"
        :key="dept"
        @click="changeDept(dept)"
        class="px-4 py-2 rounded-lg border"
        :class="selectedDept === dept ? 'bg-sky-600 text-white' : 'bg-white'"
      >
        {{ dept }}
      </button>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="text-center py-10 text-gray-500">
      로딩 중...
    </div>

    <!-- 의사 없음 -->
    <div v-else-if="doctors.length === 0" class="text-center py-10 text-gray-500">
      해당 진료과 의사가 없습니다.
    </div>

    <!-- 의사 목록 -->
    <div v-else class="space-y-4">
      <div
        v-for="doctor in doctors"
        :key="doctor.id"
        class="p-5 border rounded-xl shadow hover:bg-gray-50 transition"
      >
        <p class="text-xl font-semibold">{{ doctor.name }} 의사</p>
        <p class="text-gray-600">진료과: {{ doctor.department }}</p>
        <p class="text-gray-600">경력: {{ doctor.career }}년</p>

        <button
          class="mt-4 w-full py-3 bg-sky-600 text-white rounded-lg"
          @click="goToTimeSelect(doctor.id)"
        >
          이 의사 예약하기 →
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "SelectDoctor",

  props: ["triageId"],

  data() {
    return {
      selectedDept: "내과",
      deptList: [
        "내과", "피부과", "정형외과", "소아과", "이비인후과",
        "정신건강의학과", "산부인과", "신경과", "치과", "비뇨의학과"
      ],
      doctors: [],
      loading: false,
    };
  },

  created() {
    this.loadDoctors();
  },

  methods: {
    async loadDoctors() {
      this.loading = true;

     const res = await fetch(
  `http://localhost:8080/api/doctor/by-dept/${this.selectedDept}`,
 
);

      this.doctors = await res.json();

      this.loading = false;
    },

    changeDept(dept) {
      this.selectedDept = dept;
      this.loadDoctors();
    },

    goToTimeSelect(doctorId) {
      this.$router.push(`/dashboard/telemedicine/select-time/${doctorId}/${this.triageId}`);
    }
  },
};
</script>
