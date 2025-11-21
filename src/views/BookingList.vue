<template>
  <div class="max-w-2xl mx-auto p-6">

    <h1 class="text-3xl font-bold mb-6 flex items-center gap-2">
      🏥 나의 예약 목록
    </h1>

    <!-- 날짜 정렬 버튼 -->
    <div class="flex gap-3 mb-6">
      <button
        class="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
        @click="sortLatest"
      >
        최신순
      </button>

      <button
        class="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
        @click="sortOldest"
      >
        오래된순
      </button>
    </div>

    <!-- 예약 없음 -->
    <div v-if="bookings.length === 0" class="text-gray-500">
      아직 예약한 내역이 없습니다.
    </div>

    <!-- 예약 카드 -->
    <div
      v-for="b in bookings"
      :key="b.id"
      class="p-5 bg-white rounded-2xl shadow-xl border mb-4 hover:scale-[1.02] hover:shadow-2xl transition transform"
    >
      <!-- 카드 헤더 -->
      <div class="flex items-center gap-4 mb-3">
        <div class="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow">
          🏥
        </div>

        <div>
          <p class="text-xl font-bold">{{ b.department }} 진료</p>
          <p class="text-gray-600 text-sm">예약 번호 #{{ b.id }}</p>
        </div>
      </div>

      <!-- 의사 정보 -->
      <div class="mt-3 p-3 bg-gray-50 rounded-lg border">
        <p class="text-gray-700">
          👨‍⚕️ <strong>{{ b.doctorName }}</strong> ({{ b.doctorDept }})
        </p>
      </div>

      <!-- 시간 정보 -->
      <div class="mt-3 p-3 bg-gray-50 rounded-lg border">
        <p class="text-gray-700">📅 {{ formatDate(b.reservedTime) }}</p>
        <p class="text-gray-700">⏰ {{ formatTime(b.reservedTime) }}</p>
      </div>

      <!-- ⭐ 문진 보기 버튼 -->
      <button
        class="mt-4 w-full py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
        @click="openTriage(b.triageId)"
      >
        문진 내용 보기 →
      </button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bookings: []
    };
  },

  mounted() {
    this.fetchBookings();
  },

  methods: {
    async fetchBookings() {
      const userId = localStorage.getItem("userId");
      console.log("📤 예약 조회 userId =", userId);

      try {
        const res = await axios.get(
          `http://localhost:8080/api/reservation/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        );

        console.log("📥 예약 목록 =", res.data);
        const reservations = res.data;

        // doctorId → 의사 정보
        for (let r of reservations) {
          const doctorRes = await axios.get(
            `http://localhost:8080/api/doctor/${r.doctorId}`
          );

          r.doctorName = doctorRes.data.name;
          r.doctorDept = doctorRes.data.department;
        }

        // 최신순
        this.bookings = reservations.sort(
          (a, b) => new Date(b.reservedTime) - new Date(a.reservedTime)
        );
      } catch (e) {
        console.error("🚨 예약 목록 불러오기 실패:", e);
      }
    },

    // 최신순 정렬
    sortLatest() {
      this.bookings.sort(
        (a, b) => new Date(b.reservedTime) - new Date(a.reservedTime)
      );
    },

    // 오래된순 정렬
    sortOldest() {
      this.bookings.sort(
        (a, b) => new Date(a.reservedTime) - new Date(b.reservedTime)
      );
    },

    openTriage(triageId) {
      if (!triageId) {
        alert("문진 정보가 없습니다.");
        return;
      }
      this.$router.push(`/dashboard/telemedicine/triage/${triageId}`);
    },

    formatDate(datetime) {
      const d = new Date(datetime);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    },

    formatTime(datetime) {
      const d = new Date(datetime);
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
  }
};
</script>
