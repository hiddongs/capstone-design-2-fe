<template>
  <div class="max-w-3xl mx-auto py-10">

    <h2 class="text-3xl font-bold mb-6">👨‍⚕️ 의사 선택</h2>

    <p class="text-gray-600 mb-6">
      {{ deptName }} 전문의를 선택하세요.
    </p>

    <div v-if="loading" class="text-center py-10">
      로딩 중...
    </div>

    <div v-else class="space-y-4">

      <div
        v-for="doctor in doctors"
        :key="doctor.id"
        class="p-5 border rounded-lg shadow hover:bg-gray-50"
      >
        <p class="text-xl font-semibold">{{ doctor.name }} 의사</p>
        <p class="text-gray-600">진료과: {{ deptName }}</p>
        <p class="text-gray-600">경력: 5~10년 (더미)</p>

        <button
          class="mt-4 w-full py-3 bg-sky-600 text-white font-semibold rounded-lg"
          @click="selectDoctor(doctor.id)"
        >
          이 의사에게 제출하기 →
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import departments from "@/data/departments";

export default {
  name: "SelectDoctor",
  props: ["dept", "triageId"],

  data() {
    return {
      doctors: [],
      loading: true,
    };
  },

  computed: {
    deptName() {
      return departments[this.dept].name;
    },
  },

  async created() {
    const res = await fetch(
      `http://localhost:8080/api/doctor/list/${this.dept}`
    );
    this.doctors = await res.json();
    this.loading = false;
  },

  methods: {
    async selectDoctor(doctorId) {
      await fetch("http://localhost:8080/api/triage/assign-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triageId: this.triageId,
          doctorId,
        }),
      });

      alert("의사에게 문진서가 제출되었습니다!");
      this.$router.push("/dashboard/home");
    },
  },
};
</script>
