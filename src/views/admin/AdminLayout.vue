<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- 사이드바 -->
    <aside class="w-64 bg-white shadow-lg p-6">
      <h1 class="text-2xl font-bold text-purple-600 mb-6">관리자</h1>

      <nav class="space-y-3">
        <router-link 
          to="/admin/dashboard" 
          class="block p-3 rounded hover:bg-purple-100"
        >
          📊 대시보드
        </router-link>

        <router-link 
          to="/admin/doctor-requests" 
          class="block p-3 rounded hover:bg-purple-100"
        >
          🩺 의사 신청 관리
        </router-link>

        <router-link 
          to="/admin/users" 
          class="block p-3 rounded hover:bg-purple-100"
        >
          👥 사용자 관리
        </router-link>

        <router-link 
          to="/admin/logs" 
          class="block p-3 rounded hover:bg-purple-100"
        >
          📜 시스템 로그
        </router-link>
      </nav>
    </aside>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 p-10">
      <router-view />
    </main>

  </div>
</template>

<script>
export default {
  name: "AdminLayout",
};
</script>
