<template>
  <div class="min-h-screen flex bg-gray-50">

    <!-- Sidebar -->
    <aside class="w-72 bg-white shadow-xl p-8 rounded-r-2xl">
      <h2 class="text-3xl font-extrabold text-sky-600">
        의사 대시보드
      </h2>

      <nav class="mt-10 space-y-3 text-lg">

        <router-link
          to="/doctor/dashboard"
          class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
        >
          🏠 홈
        </router-link>

        <router-link
          to="/doctor/reservations"
          class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
        >
          📅 예약 관리
        </router-link>

        <router-link
          to="/doctor/triage"
          class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
        >
          📝 문진 요청
        </router-link>

        <router-link
          to="/doctor/profile"
          class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
        >
          👤 프로필
        </router-link>

      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-10">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "DoctorLayout"
};
</script>

<style scoped>
</style>
