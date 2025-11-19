<template>
  <div id="app" class="min-h-screen bg-gray-50">

    <!-- 네비게이션 바 -->
    <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-10 py-4 flex justify-between items-center">

        <!-- 로고 -->
        <router-link
          to="/"
          class="flex items-center space-x-3 hover:opacity-80 transition"
        >
          <img
            src="@/assets/icons/capstoneLogo.png"
            alt="알약 크루 로고"
            class="w-12 h-auto object-contain"
          />
          <h1 class="text-2xl font-bold text-sky-600 tracking-tight">알약 크루</h1>
        </router-link>

        <!-- 메뉴 -->
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

          <!-- 로그인/로그아웃 -->
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
      </div>
    </nav>

    <!-- 메인 페이지 (대시보드 기반 정렬 동일 적용) -->
    <main class="p-6 flex justify-center">
      <div class="w-full max-w-7xl">
        <router-view />
      </div>
    </main>
<!-- ===== Footer ===== -->
<footer class="bg-gray-100 border-t border-gray-300 mt-20 py-12">
  <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

    <!-- 회사소개 -->
    <div>
      <h3 class="text-lg font-semibold text-sky-600 mb-3">회사소개</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li class="hover:text-sky-600 cursor-pointer">알약 크루 소개</li>
        <li class="hover:text-sky-600 cursor-pointer">개발자 정보</li>
        <li class="hover:text-sky-600 cursor-pointer">프로젝트 목적</li>
        <li class="hover:text-sky-600 cursor-pointer">파트너스</li>
      </ul>
    </div>

    <!-- 고객센터 -->
    <div>
      <h3 class="text-lg font-semibold text-sky-600 mb-3">고객센터</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li class="hover:text-sky-600 cursor-pointer">FAQ</li>
        <li class="hover:text-sky-600 cursor-pointer">문의하기</li>
        <li class="hover:text-sky-600 cursor-pointer">도움말</li>
        <li class="hover:text-sky-600 cursor-pointer">서비스 장애 신고</li>
      </ul>
    </div>

    <!-- 서비스 안내 -->
    <div>
      <h3 class="text-lg font-semibold text-sky-600 mb-3">서비스 안내</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li class="hover:text-sky-600 cursor-pointer">비대면 의료 상담</li>
        <li class="hover:text-sky-600 cursor-pointer">AI 질환 분석</li>
        <li class="hover:text-sky-600 cursor-pointer">실시간 상담 게시판</li>
        <li class="hover:text-sky-600 cursor-pointer">병원 지도 서비스</li>
      </ul>
    </div>

    <!-- SNS / Social -->
    <div>
      <h3 class="text-lg font-semibold text-sky-600 mb-3">SNS</h3>
      <div class="flex space-x-4 text-2xl text-gray-600">
        <span class="cursor-pointer hover:text-sky-600">📘</span>
        <span class="cursor-pointer hover:text-sky-600">📷</span>
        <span class="cursor-pointer hover:text-sky-600">🐦</span>
        <span class="cursor-pointer hover:text-sky-600">▶️</span>
      </div>
    </div>
  </div>

  <!-- 법적 안내 텍스트 -->
  <div class="mt-10 text-center text-xs text-gray-500 px-4 leading-relaxed">
    본 서비스는 「의료법 제17조의2 비대면 진료 가이드라인」을 준수하여 운영되는<br>
    **참고용 건강 정보 및 AI 기반 상담 서비스**이며, 실제 전문의의 진단 및 처방을 대체하지 않습니다.<br>
    응급상황이 의심될 경우 119 또는 가까운 응급실을 즉시 방문하시기 바랍니다.
  </div>

  <p class="text-center text-[11px] text-gray-400 mt-6">
    © 2025 Alyak Crew. All rights reserved.
  </p>
</footer>

<!-- ===== 맨 위로 버튼 ===== -->
<button
  v-show="showScrollTop"
  @click="scrollToTop"
  class="fixed bottom-8 right-8 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full shadow-lg text-xl transition z-50"
>
  ↑
</button>

  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
    };
  },

  created() {
    this.checkLoginStatus();
  },

  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("accessToken");
    },

    logout() {
      localStorage.removeItem("accessToken");
      this.isLoggedIn = false;
      alert("로그아웃되었습니다.");
      this.$router.push("/login");
    }, // 🔥 스크롤 버튼 제어
    handleScroll() {
      this.showScrollTop = window.scrollY > 300;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  

  watch: {
    $route() {
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
/* 부드러운 등장 */
button[v-show] {
  transition: opacity 0.3s ease;
}

</style>
