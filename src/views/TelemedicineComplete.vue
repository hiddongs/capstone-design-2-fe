<template>
  <div class="max-w-xl mx-auto py-10 px-4">

    <!-- 완료 아이콘 -->
    <div class="flex justify-center mb-6">
      <div
        class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex justify-center items-center text-4xl shadow"
      >
        ✓
      </div>
    </div>

    <!-- 타이틀 -->
    <h1 class="text-3xl font-bold text-center text-sky-600 mb-4">
      예약 완료!
    </h1>

    <p class="text-center text-gray-700 mb-8">
      비대면 진료 예약이 성공적으로 접수되었습니다.
    </p>

    <!-- 예약 정보 카드 -->
    <div class="bg-white p-6 rounded-2xl shadow mb-8">
      <h2 class="text-xl font-semibold mb-4">📅 예약 정보</h2>

      <p class="text-gray-700 mb-2">
        <span class="font-semibold">예약번호:</span> {{ bookingId }}
      </p>

      <p class="text-gray-700 mb-2" v-if="booking.doctorName">
        <span class="font-semibold">담당 의사:</span> {{ booking.doctorName }} 의사
      </p>

      <p class="text-gray-700 mb-2" v-if="booking.department">
        <span class="font-semibold">진료과:</span> {{ booking.department }}
      </p>

      <p class="text-gray-700 mb-2" v-if="booking.reservedTime">
        <span class="font-semibold">예약 시간:</span> {{ formatDate(booking.reservedTime) }}
      </p>

      <p class="text-gray-500 text-sm mt-4">
        예약 시간 몇 분 전 미리 접속하여 대기해 주세요.
      </p>
    </div>

    <!-- 버튼 -->
    <button
      class="w-full py-4 bg-sky-600 text-white text-lg font-semibold rounded-lg mb-4"
      @click="goToBookingList"
    >
      내 예약 확인하기 →
    </button>

    <button
      class="w-full py-3 bg-gray-100 text-gray-700 rounded-lg"
      @click="goHome"
    >
      홈으로 돌아가기
    </button>

  </div>
</template>

<script>
export default {
  name: "TelemedicineComplete",

  data() {
    return {
      bookingId: this.$route.params.bookingId,
      booking: {},
    };
  },

  async created() {
    // 예약 상세 정보 가져오기
    const res = await fetch(`http://localhost:8080/api/reservation/detail/${this.bookingId}`);
    if (res.ok) {
      this.booking = await res.json();
    }
  },

  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    },

    goToBookingList() {
      this.$router.push("/dashboard/booking-list");
    },

    goHome() {
      this.$router.push("/dashboard/home");
    },
  },
};
</script>

<style scoped></style>
