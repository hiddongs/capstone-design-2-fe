<template>
  <div>
    <h1 class="text-3xl font-bold text-purple-700 mb-6">📊 관리자 대시보드</h1>

    <div class="grid grid-cols-3 gap-6">

      <div class="bg-white p-6 shadow rounded-xl">
        <h2 class="text-gray-500">총 사용자 수</h2>
        <p class="text-3xl font-bold">{{ stats.users }}</p>
      </div>

      <div class="bg-white p-6 shadow rounded-xl">
        <h2 class="text-gray-500">의사 신청(대기)</h2>
        <p class="text-3xl font-bold text-yellow-600">{{ stats.pendingDoctors }}</p>
      </div>

      <div class="bg-white p-6 shadow rounded-xl">
        <h2 class="text-gray-500">승인된 의사 수</h2>
        <p class="text-3xl font-bold text-green-600">{{ stats.approvedDoctors }}</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",

  data() {
    return {
      stats: {
        users: 0,
        pendingDoctors: 0,
        approvedDoctors: 0,
      },
    };
  },

  async created() {
    const res = await fetch("http://localhost:8080/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    this.stats = await res.json();
  },
};
</script>

<style scoped></style>
