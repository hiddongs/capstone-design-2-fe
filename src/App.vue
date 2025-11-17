<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- 네비게이션 바 -->
    <nav
      class="bg-white shadow-sm border-b border-gray-100 px-10 py-4 flex justify-between items-center sticky top-0 z-50"
    >
      <!-- 로고 영역 -->
       <router-link
        to="/"
        class="flex items-center space-x-3 hover:opacity-80 transition"
      >
        <img
          src="@/assets/icons/capstoneLogo.png"
          alt="알약 크루 로고"
          class="w-12 h-auto object-contain"
        />
        <h1 class="text-2xl font-bold text-sky-600 tracking-tight">
          알약 크루
        </h1>
      </router-link>

      <!-- 메뉴 영역 -->
      <div class="flex items-center space-x-8">
        <router-link
          to="/"
          class="text-gray-700 font-medium hover:text-sky-600 transition"
          active-class="text-sky-600 font-semibold"
        >
          홈
        </router-link>

        <router-link
          to="/dashboard"
          class="text-gray-700 font-medium hover:text-sky-600 transition"
          active-class="text-sky-600 font-semibold"
        >
          대시보드
        </router-link>

          <!-- 로그인 / 로그아웃 전환 -->
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition shadow-sm"
        >
          로그아웃
        </button>

        <router-link
          v-else
          to="/login"
          class="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg font-semibold transition shadow-sm"
        >
          로그인
        </router-link>
      </div>
    </nav>

    <!-- ✅ 라우트 컴포넌트 렌더링 -->
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return {
      isLoggedIn:false,
    };
  },
  created(){
    this.checkLoginStatus();
  },
  methods:{
    checkLoginStatus(){
      this.isLoggedIn = !!localStorage.getItem("accessToken");
    },
    logout(){
      localStorage.removeItem("accessToken");
      this.isLoggedIn = false;
      alert("로그아웃되었습니다.");
      this.$router.push("/login");

    },
  },
  watch:{
    $route(){
      this.checkLoginStatus();
    },
  },
};
</script>

<style scoped>
nav {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
