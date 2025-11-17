<template>
  <div class="max-w-4xl mx-auto py-10">

    <div
      class="rounded-2xl p-8 mb-8 text-white shadow-lg flex items-center gap-4"
      :style="{ backgroundColor: currentDept.color }"
    >
      <div class="text-5xl">
        {{ currentDept.icon }}
      </div>

      <div>
        <h1 class="text-3xl font-bold mb-1">{{ currentDept.name }}</h1>
        <p class="text-white/90 text-lg">{{ currentDept.description }}</p>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">📌 주요 증상</h2>

      <ul class="space-y-2">
        <li
          v-for="(symptom, idx) in currentDept.symptoms"
          :key="idx"
          class="border-b py-2 text-gray-700"
        >
          {{ symptom }}
        </li>
      </ul>
    </div>

    <div class="p-6 bg-white shadow-md rounded-2xl">
      <h2 class="text-xl font-semibold mb-4">💻 비대면 진료 상담</h2>
      <p class="text-gray-600 mb-4">
        AI 문진 후 실제 의료진과 연결됩니다.
      </p>

      <button
        class="w-full py-4 rounded-lg text-white text-lg font-semibold shadow"
        :style="{ backgroundColor: currentDept.color }"
        @click="startForm"
      >
        AI 문진 시작하기 →
      </button>
    </div>
  </div>
</template>

<script>
import departments from "@/data/departments";

export default {
  name: "TelemedicinePage",
  props: ["dept"],

  computed: {
    currentDept() {
      return departments[this.dept] || {
        name: "알 수 없는 진료과",
        icon: "❓",
        description: "",
        symptoms: [],
        color: "#3B82F6",
      };
    },
  },

  methods: {
    startForm() {
      this.$router.push(`/dashboard/telemedicine/${this.dept}/form`);
    },
  },
};
</script>
