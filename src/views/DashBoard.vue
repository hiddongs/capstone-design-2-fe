<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-6">
      <h2 class="text-2xl font-bold text-sky-600">대시보드</h2>

      <nav class="mt-8 space-y-2">
        <router-link to="/dashboard/home"
          class="block py-2 px-4 rounded hover:bg-sky-500 hover:text-white">
          🏠 홈
        </router-link>

        <router-link to="/dashboard/info"
          class="block py-2 px-4 rounded hover:bg-sky-500 hover:text-white">
          🏥 병원 검색
        </router-link>

        <router-link to="/dashboard/qna"
          class="block py-2 px-4 rounded hover:bg-sky-500 hover:text-white">
          💬 실시간 Q&A
        </router-link>

        <router-link to="/dashboard/ai-chat"
          class="block py-2 px-4 rounded hover:bg-sky-500 hover:text-white">
          🤖 AI 채팅
        </router-link>

        <!-- 비대면 진료 -->
        <div>
          <button
            @click="toggleTele"
            class="w-full text-left py-2 px-4 rounded hover:bg-sky-500 hover:text-white flex justify-between items-center"
          >
            <span>💻 비대면 진료</span>
            <span>{{ teleOpen ? "▲" : "▼" }}</span>
          </button>

          <!-- 슬라이드 애니메이션 -->
          <transition name="slide">
            <div
              v-if="teleOpen"
              class="ml-4 mt-1 space-y-1"
            >
              <router-link
                v-for="dept in departments"
                :key="dept.name"
                :to="dept.route"
                class="block py-1 px-3 text-sm rounded hover:bg-sky-400 hover:text-white"
              >
                • {{ dept.name }}
              </router-link>
            </div>
          </transition>
        </div>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "DashboardLayout",
  data() {
    return {
      teleOpen: false,
      departments: [
        { name: "내과", route: "/dashboard/telemedicine/internal" },
        { name: "외과", route: "/dashboard/telemedicine/surgery" },
        { name: "정형외과", route: "/dashboard/telemedicine/ortho" },
        { name: "이비인후과", route: "/dashboard/telemedicine/ent" },
        { name: "피부과", route: "/dashboard/telemedicine/dermatology" },
        { name: "비뇨의학과", route: "/dashboard/telemedicine/urology" },
        { name: "산부인과", route: "/dashboard/telemedicine/obstetrics" },
        { name: "정신건강의학과", route: "/dashboard/telemedicine/mental" },
        { name: "소아과", route: "/dashboard/telemedicine/pediatrics" },
        { name: "안과", route: "/dashboard/telemedicine/ophthalmology" },
        { name: "치과", route: "/dashboard/telemedicine/dentistry" },
        { name: "신경과", route: "/dashboard/telemedicine/neurology" },
      ],
    };
  },

  methods: {
    toggleTele() {
      this.teleOpen = !this.teleOpen;
    },
  },
};
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
