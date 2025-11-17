<template>
  <div class="max-w-3xl mx-auto py-10">
    <h1 class="text-3xl font-bold mb-4">📄 문진 결과</h1>

    <div class="bg-white p-6 rounded-2xl shadow mb-8">
      <h2 class="text-xl font-semibold">{{ summary.departmentName }}</h2>
      <p class="text-gray-600 mb-4">작성 시간: {{ formattedDate }}</p>

      <h3 class="text-lg font-semibold mb-2">요약</h3>
      <p class="p-3 border rounded-lg bg-gray-50 mb-4">{{ aiSummary }}</p>

      <h3 class="text-lg font-semibold mb-2">문진 상세</h3>
      <ul class="space-y-2">
        <li
          v-for="(item, idx) in summary.answers"
          :key="idx"
          class="p-3 border rounded-lg"
        >
          <p class="font-semibold">{{ item.question }}</p>
          <p class="text-gray-700">{{ item.answer }}</p>
        </li>
      </ul>
    </div>

    <button
      class="w-full py-4 bg-sky-600 text-white text-lg font-semibold rounded-lg"
    >
      의사에게 제출하기 →
    </button>
  </div>
</template>

<script>
export default {
  name: "TelemedicineResult",

  data() {
    return {
      summary: history.state.summary,
      aiSummary: history.state.summary.aiSummary || "요약 생성 중...",
    };
  },

  computed: {
    formattedDate() {
      return new Date(this.summary.createdAt).toLocaleString();
    },
  },
};
</script>
