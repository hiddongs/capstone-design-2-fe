<template>
  <div class="max-w-5xl mx-auto mt-10 bg-white p-8 shadow rounded-xl">
    <h1 class="text-3xl font-bold text-purple-700 mb-8">🩺 의사 전환 신청 관리</h1>

    <table class="w-full border text-left">
      <thead>
        <tr class="bg-gray-100 border-b">
          <th class="p-3">ID</th>
          <th class="p-3">사용자 ID</th>
          <th class="p-3">면허번호</th>
          <th class="p-3">병원명</th>
          <th class="p-3">진료과</th>
          <th class="p-3">상태</th>
          <th class="p-3">관리</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="req in requests" :key="req.id" class="border-b hover:bg-gray-50">
        <td class="p-3">{{ req.id }}</td>
        <td class="p-3">{{ req.userId }}</td>
        <td class="p-3">{{ req.name }}</td>
        <td class="p-3">{{ req.licenseNumber }}</td>
        <td class="p-3">{{ req.hospitalName }}</td>
        <td class="p-3">{{ req.department || '-' }}</td>

          <td class="p-3 font-bold">
            <span v-if="req.status === 'PENDING'" class="text-yellow-600">대기중</span>
            <span v-if="req.status === 'APPROVED'" class="text-green-600">승인됨</span>
            <span v-if="req.status === 'REJECTED'" class="text-red-600">거절됨</span>
          </td>

          <td class="p-3 space-x-2">
            <button
              v-if="req.status === 'PENDING'"
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              @click="approve(req.id)"
            >
              승인
            </button>

            <button
              v-if="req.status === 'PENDING'"
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              @click="reject(req.id)"
            >
              거절
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AdminDoctorRequests",

  data() {
    return {
      requests: [],
    };
  },

  async created() {
    try {
      const res = await fetch("http://localhost:8080/api/doctor-apply/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!res.ok) throw new Error("리스트 조회 실패");

      this.requests = await res.json();
    } catch (e) {
      alert("데이터 로드 실패: " + e.message);
    }
  },

  methods: {
    async approve(id) {
      if (!confirm("정말 승인하시겠습니까?")) return;

      await fetch(`http://localhost:8080/api/doctor-apply/approve/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      alert("승인되었습니다.");
      this.reload();
    },

    async reject(id) {
      if (!confirm("정말 거절하시겠습니까?")) return;

      await fetch(`http://localhost:8080/api/doctor-apply/reject/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      alert("거절되었습니다.");
      this.reload();
    },

    reload() {
      location.reload();
    },
  },
};
</script>

<style scoped></style>
