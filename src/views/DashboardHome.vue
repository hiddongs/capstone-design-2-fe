<template>
  <div>
    <div class="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg p-8 mb-8">
      <h1 class="text-3xl font-bold">안녕하세요, {{ userName }} 님 👋</h1>
      <p class="text-lg opacity-90">오늘도 건강한 하루 되세요 🌿</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="card in cards" :key="card.title" class="bg-white shadow-md p-6 rounded-lg hover:shadow-xl">
        <h3 class="text-xl font-semibold text-sky-600 mb-2">{{ card.title }}</h3>
        <p class="text-gray-600 mb-4">{{ card.desc }}</p>
        <router-link :to="card.link" class="text-sky-500 hover:underline">{{ card.action }} →</router-link>
      </div>
    </div>

    <section class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-4">오늘의 건강 팁 🩵</h2>
      <p class="text-gray-700">💡 하루 10분 스트레칭은 혈류를 개선하고 두통 완화에 도움이 됩니다.</p>
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
        { title: "AI 진단", desc: "AI가 질병 가능성을 분석합니다.", link: "/dashboard/ai-chat", action: "진단 시작" },
        { title: "병원 검색", desc: "근처 병원을 빠르게 찾아보세요.", link: "/dashboard/info", action: "검색하기" },
        { title: "비대면 상담", desc: "의료진과 실시간 상담을 진행하세요.", link: "/dashboard/qna", action: "시작하기" },
      ],
    };
  },
};
</script>
