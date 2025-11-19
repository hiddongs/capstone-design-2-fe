<template>
  <div class="min-h-screen flex bg-gray-50 justify-center">

    <!-- 전체 래퍼 -->
    <div class="flex w-full max-w-7xl">

      <!-- Sidebar -->
      <aside class="w-72 bg-white shadow-xl p-8 rounded-r-2xl">
        <h2 class="text-3xl font-extrabold text-sky-600 tracking-tight">
          대시보드
        </h2>

        <nav class="mt-10 space-y-3 text-lg">

          <!-- 마이페이지 -->
          <router-link
            to="/dashboard/mypage"
            class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
          >
            👤 마이페이지
          </router-link>

          <router-link
            to="/dashboard/home"
            class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
          >
            🏠 홈
          </router-link>

          <router-link
            to="/dashboard/info"
            class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
          >
            🏥 병원 검색
          </router-link>

          <router-link
            to="/dashboard/board-list"
            class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
          >
            💬 실시간 Q&A
          </router-link>

          <router-link
            to="/dashboard/ai-chat"
            class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
          >
            🤖 AI 채팅
          </router-link>

          <router-link
            to="/dashboard/disease-encyclopedia"
            class="block py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition"
          >
            📚 질병 백과사전
          </router-link>

          <!-- 비대면 진료 드롭다운 -->
          <div>
            <button
              @click="toggleTele"
              class="w-full text-left py-3 px-5 rounded-xl hover:bg-sky-500 hover:text-white transition flex justify-between items-center"
            >
              <span>💻 비대면 진료</span>
              <span>{{ teleOpen ? "▲" : "▼" }}</span>
            </button>

            <transition name="slide">
              <div
                v-if="teleOpen"
                class="ml-4 mt-2 space-y-2"
              >
                <router-link
                  v-for="dept in departments"
                  :key="dept.name"
                  :to="dept.route"
                  class="block py-2 px-4 text-base rounded-lg hover:bg-sky-400 hover:text-white transition"
                >
                  • {{ dept.name }}
                </router-link>
              </div>
            </transition>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-10 flex justify-center">
        <div class="w-full max-w-5xl">
          <router-view />
        </div>
      </main>

    </div>
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
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
