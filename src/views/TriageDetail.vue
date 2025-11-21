<template>
  <div class="max-w-3xl mx-auto py-10">
    <h1 class="text-3xl font-bold mb-4">📝 문진 상세</h1>

    <div v-if="!data" class="text-gray-500">로딩 중...</div>

    <div v-else class="bg-white p-6 rounded-2xl shadow">
      <h2 class="text-xl font-semibold mb-3">
        {{ data.departmentName }} 문진
      </h2>

      <p class="text-gray-600 mb-4">
        작성 시간: {{ formatDate(data.createdAt) }}
      </p>

      <h3 class="font-semibold text-lg mb-3">요약</h3>
      <p class="p-3 border bg-gray-50 rounded mb-6">{{ data.aiSummary }}</p>

      <h3 class="font-semibold text-lg mb-3">상세 답변</h3>
      <div v-for="(item, idx) in data.answers" :key="idx" class="p-3 border rounded mb-3">
        <p class="font-semibold">{{ item.question }}</p>
        <p>{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["triageId"],
  data() {
    return { data: null };
  },
  async created() {
    const res = await fetch(`http://localhost:8080/api/triage/${this.triageId}`);
    this.data = await res.json();
  },
  methods: {
    formatDate(x) {
      return new Date(x).toLocaleString();
    }
  }
};
</script>
