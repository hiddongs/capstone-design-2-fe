<template>
  <div>
    <!-- Header Welcome Banner -->
    <div
      class="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl p-8 mb-10 shadow-md"
    >
      <h1 class="text-3xl font-bold">안녕하세요, {{ userName }} 님 👋</h1>
      <p class="text-lg opacity-90 mt-2">오늘도 건강한 하루 보내세요 🌿</p>
    </div>

    <!-- Quick Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div
        v-for="card in cards"
        :key="card.title"
        class="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition border border-gray-100"
      >
        <h3 class="text-xl font-semibold text-sky-600 mb-2">
          {{ card.title }}
        </h3>
        <p class="text-gray-600 mb-4">{{ card.desc }}</p>
        <router-link :to="card.link" class="text-sky-500 hover:underline">
          {{ card.action }} →
        </router-link>
      </div>
    </div>

    <!-- Middle Section: Health Stats + AI Recommendation -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

      <!-- Health Stats -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">내 건강 현황 📊</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div
            v-for="s in stats"
            :key="s.label"
            class="p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <p class="text-3xl font-bold text-sky-600">{{ s.value }}</p>
            <p class="mt-1 text-gray-600 text-sm">{{ s.label }}</p>
          </div>
        </div>
      </div>

      <!-- AI Recommendation -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">AI 맞춤 추천 🧠</h2>

        <p class="text-gray-700 leading-relaxed">
          {{ aiTip }}
        </p>

        <button
          @click="generateAiTip"
          class="mt-4 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
        >
          새로운 팁 받기
        </button>
      </div>
    </div>

    <!-- Recent Activities / History -->
    <section class="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 class="text-2xl font-semibold mb-4">최근 활동 내역 🕒</h2>

      <div v-if="recent.length > 0" class="space-y-3">
        <div
          v-for="item in recent"
          :key="item.text"
          class="flex justify-between bg-gray-50 p-4 rounded-lg border border-gray-100"
        >
          <span class="text-gray-700">{{ item.text }}</span>
          <span class="text-gray-500 text-sm">{{ item.time }}</span>
        </div>
      </div>

      <p v-else class="text-gray-500">아직 활동 내역이 없습니다.</p>
    </section>

    <!-- Today's Health Tip -->
    <section class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-4">오늘의 건강 팁 🩵</h2>
      <p class="text-gray-700">
        💡 하루 10분 스트레칭은 혈류 개선과 피로 회복에 효과적입니다!
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: "DashboardHome",
  data() {
    return {
      userName: localStorage.getItem("username") || "사용자",

      cards: [
        {
          title: "AI 진단",
          desc: "AI가 질병 가능성을 분석해드립니다.",
          link: "/dashboard/ai-chat",
          action: "진단 시작",
        },
        {
          title: "병원 검색",
          desc: "가까운 병원을 빠르게 찾아보세요.",
          link: "/dashboard/info",
          action: "검색하기",
        },
        {
          title: "비대면 상담",
          desc: "전문의와 실시간 상담을 받아보세요.",
          link: "/dashboard/qna",
          action: "상담하기",
        },
      ],

      stats: [
        { value: "3회", label: "이번달 진료 횟수" },
        { value: "2개", label: "복용 중 약물" },
        { value: "95%", label: "AI 분석 정확도" },
        { value: "정상", label: "오늘 건강 상태" },
      ],

      aiTip: "AI 기반으로 건강 관련 정보를 불러오는 중입니다...",

      recent: [
        { text: "AI 진단 진행", time: "오늘" },
        { text: "이비인후과 비대면 상담", time: "2일 전" },
        { text: "병원 검색 – 정형외과", time: "3일 전" },
      ],
    };
  },

  mounted() {
    this.generateAiTip();
  },

  methods: {
    generateAiTip() {
      const tips = [
        "물을 충분히 마시는 것은 피로 회복에 큰 도움이 됩니다.",
        "가벼운 산책은 스트레스 감소와 혈액순환 개선에 효과적입니다.",
        "손 씻기는 감염병 예방의 가장 기본적인 습관입니다.",
        "너무 늦게 자지 말고 수면 패턴을 일정하게 유지하세요.",
        "긴장될 때는 복식호흡을 1분만 해도 몸이 훨씬 편해집니다.",
      ];

      this.aiTip = tips[Math.floor(Math.random() * tips.length)];
    },
  },
};
</script>

<style scoped>
</style>
