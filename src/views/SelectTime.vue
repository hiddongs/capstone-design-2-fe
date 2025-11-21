<template>
  <div class="max-w-xl mx-auto p-6">

    <!-- 제목 -->
    <h2 class="text-3xl font-bold mb-4">🕒 예약 시간 선택</h2>

    <!-- 의사 정보 -->
    <div
      v-if="doctorName"
      class="p-4 mb-6 rounded-xl shadow bg-white border flex items-center gap-4"
    >
      <div class="text-4xl">👨‍⚕️</div>
      <div>
        <p class="text-xl font-semibold">{{ doctorName }} 의사</p>
        <p class="text-gray-600">{{ doctorDept }}</p>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="text-center text-gray-500 py-10">
      로딩 중...
    </div>

    <!-- 시간 선택 -->
    <div v-else>
      <h3 class="text-xl font-semibold mb-3">📅 가능한 예약 시간</h3>

      <div
        v-if="slots.length === 0"
        class="text-center py-12 text-gray-500 border rounded-xl"
      >
        선택 가능한 시간이 없습니다.
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-3"
      >
        <button
          v-for="t in slots"
          :key="t"
          class="p-3 border rounded-lg bg-white shadow hover:bg-sky-100 hover:border-sky-400 transition"
          @click="reserve(t)"
        >
          {{ format(t) }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "SelectTime",

  data() {
    return {
      slots: [],
      doctorName: "",
      doctorDept: "",
      loading: true,
    };
  },

  async created() {
    try {
      const doctorId = this.$route.params.doctorId;

      // 🟦 시간 슬롯 가져오기
      const res = await fetch(
        `http://localhost:8080/api/reservation/slots/doctor/${doctorId}`
      );
      this.slots = await res.json();

      // 🟩 의사 정보 가져오기
      const doctorRes = await fetch(
        `http://localhost:8080/api/doctor/${doctorId}`
      );
      const doc = await doctorRes.json();

      this.doctorName = doc.name;
      this.doctorDept = doc.department;
    } catch (e) {
      console.error("시간/의사 정보 로딩 실패:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    format(dateStr) {
      const d = new Date(dateStr);
      const h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    },

   async reserve(time) {
  if (!confirm(`${this.format(time)} 시간으로 예약하시겠습니까?`)) return;

  const body = {
    userId: Number(localStorage.getItem("userId")),
    triageId: Number(this.$route.params.triageId),
    doctorId: Number(this.$route.params.doctorId),
    reservedTime: time,
    department: this.doctorDept ?? ""   // null 방지
  };

  console.log("예약 요청 body =", body);

  const res = await fetch("http://localhost:8080/api/reservation/create", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("accessToken") 
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("예약 실패:", res.status);
    alert("예약 실패: " + res.status);
    return;
  }

  const bookingId = await res.text();

  this.$router.push(`/dashboard/telemedicine/complete/${bookingId}`);
}

  },
};
</script>

<style scoped>
</style>
