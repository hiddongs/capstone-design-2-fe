<template>
  <div class="min-h-screen bg-gray-50">

    <!-- HERO SECTION -->
    <section class="relative overflow-hidden h-[85vh] flex items-center justify-center">
      
      <!-- Background -->
      <img
        :src="heroImage"
        class="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

      <!-- Text -->
      <div class="relative z-10 text-center max-w-3xl px-6" data-aos="fade-up">

        <!-- 로그인 X 상태 -->
        <template v-if="!isLoggedIn">
          <h1 class="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
            AI 비대면 진료 서비스
          </h1>

          <p class="text-xl text-gray-200 mt-6">
            인공지능 기반 실시간 분석과 전문 의사의 검진을 한 곳에서
          </p>

          <div class="mt-10 flex justify-center space-x-4">
            <router-link to="/login">
              <button class="px-8 py-3 text-lg bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xl transition">
                로그인
              </button>
            </router-link>

            <router-link to="/signup">
              <button class="px-8 py-3 text-lg bg-white/90 backdrop-blur text-sky-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition shadow">
                회원가입
              </button>
            </router-link>
          </div>
        </template>

        <!-- 로그인 O 상태 - 사용자/의사 별로 문구 다르게 -->
        <template v-else>
          <h1 class="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
            {{ role === 'ROLE_DOCTOR' ? '의사님 환영합니다' : '다시 오신 걸 환영합니다' }}
          </h1>

          <p class="text-xl text-gray-200 mt-6">
            {{ role === 'ROLE_DOCTOR' 
              ? '환자들의 상담을 빠르고 정확하게 도와주세요.' 
              : 'AI 분석과 맞춤형 의료 서비스를 계속 이용해보세요.' }}
          </p>

          <div class="mt-10 flex justify-center space-x-4">
            <router-link :to="dashboardLink">
              <button class="px-8 py-3 text-lg bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xl transition">
                대시보드로 이동 →
              </button>
            </router-link>
          </div>
        </template>
      </div>

    </section>


    <!-- FEATURES SECTION -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <h2 class="text-4xl font-bold text-center text-gray-800 mb-4" data-aos="fade-up">
        주요 기능
      </h2>

      <p class="text-center text-gray-600 mb-14" data-aos="fade-up">
        알약크루가 제공하는 핵심 기능들을 만나보세요
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          v-for="(f, index) in features"
          :key="index"
          class="bg-white/80 backdrop-blur shadow-md rounded-2xl p-10 hover:shadow-xl transition border border-gray-100"
          data-aos="fade-up"
          :data-aos-delay="index * 200"
        >
          <img :src="f.img" class="w-24 h-24 mx-auto rounded-xl mb-6 shadow" />
          <h3 class="text-2xl font-semibold text-gray-700 text-center mb-2">{{ f.title }}</h3>
          <p class="text-gray-600 text-center">{{ f.desc }}</p>
        </div>
      </div>
    </section>


    <!-- Stats Section -->
    <section class="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-24">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-14" data-aos="fade-up">
          서비스 성과
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div
            v-for="(s, index) in stats"
            :key="index"
            class="p-6"
            data-aos="fade-up"
            :data-aos-delay="index * 200"
          >
            <p class="text-5xl font-extrabold">{{ s.value }}</p>
            <p class="text-lg mt-2 opacity-90">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>


    <!-- Reviews Section -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <h2 class="text-4xl font-bold text-center mb-14 text-gray-800" data-aos="fade-up">
        실제 후기
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          v-for="(r, index) in reviews"
          :key="index"
          class="bg-white shadow-md rounded-2xl p-8 text-center hover:shadow-xl transition"
          data-aos="fade-up"
          :data-aos-delay="index * 250"
        >
          <img :src="r.img" class="w-20 h-20 rounded-full mx-auto mb-4 shadow" />
          <p class="text-gray-600 italic">“{{ r.text }}”</p>
          <p class="mt-4 font-semibold">{{ r.name }}</p>
        </div>
      </div>
    </section>


    <!-- CTA -->
    <section class="bg-gray-900 py-24 text-center text-white">
      <h2 class="text-4xl font-bold mb-4" data-aos="fade-up">지금 바로 시작하세요</h2>
      <p class="text-lg text-gray-300 mb-10" data-aos="fade-up" data-aos-delay="200">
        병원 갈 시간이 부족한 현대인을 위한 의료 서비스
      </p>

      <router-link to="/signup" v-if="!isLoggedIn">
        <button class="px-12 py-4 bg-sky-500 hover:bg-sky-600 rounded-xl text-lg font-semibold shadow-xl transition" data-aos="zoom-in">
          회원가입 →
        </button>
      </router-link>

      <router-link :to="dashboardLink" v-else>
        <button class="px-12 py-4 bg-sky-500 hover:bg-sky-600 rounded-xl text-lg font-semibold shadow-xl transition" data-aos="zoom-in">
          대시보드로 이동 →
        </button>
      </router-link>
    </section>

  </div>
</template>

<script>
import AOS from "aos";
import "aos/dist/aos.css";

export default {
  name: "Home",

  data() {
    return {
      isLoggedIn: false,
      role: null,
      dashboardLink: "/",

      heroImage: require("@/assets/medi.jpg"),

      features: [
        {
          img: require("@/assets/ai_healthcare.jpg"),
          title: "AI 건강 분석",
          desc: "증상 분석, 질병 가능성 안내",
        },
        {
          img: require("@/assets/remote_consultation.jpg"),
          title: "원격 화상 진료",
          desc: "의료진과 실시간 상담 가능",
        },
        {
          img: require("@/assets/medical_reports.jpg"),
          title: "진단서 관리",
          desc: "기록 및 진단서 보관 기능",
        },
      ],

      stats: [
        { value: "98%", label: "사용자 만족도" },
        { value: "24/7", label: "AI 진료 사용 가능" },
        { value: "30만+", label: "누적 상담량" },
      ],

      reviews: [
        {
          img: require("@/assets/patient1.jpg"),
          text: "AI 분석 덕분에 빠르게 진료 받을 수 있었어요.",
          name: "박지현",
        },
        {
          img: require("@/assets/patient2.jpg"),
          text: "진단서 발급도 쉬워서 편하게 이용했습니다.",
          name: "김성훈",
        },
        {
          img: require("@/assets/patient3.jpg"),
          text: "비대면 진료의 새로운 기준을 만든 서비스!",
          name: "신은지",
        },
      ],
    };
  },

  created() {
    // 로그인 여부 및 역할 가져오기
    this.isLoggedIn = !!localStorage.getItem("accessToken");
    this.role = localStorage.getItem("role");

    // 역할에 따라 대시보드 경로 지정
    if (this.role === "ROLE_DOCTOR") {
      this.dashboardLink = "/doctor/dashboard";
    } else if (this.role === "ROLE_USER") {
      this.dashboardLink = "/dashboard/home";
    }

    AOS.init({
      duration: 800,
      easing: "ease-out-quart",
      once: true,
    });
  },
};
</script>

<style scoped>
</style>
