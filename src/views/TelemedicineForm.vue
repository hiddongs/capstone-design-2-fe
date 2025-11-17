<template>
  <div class="max-w-3xl mx-auto py-10">

    <h2 class="text-3xl font-bold mb-6">📝 AI 문진</h2>

    <div class="bg-white p-6 rounded-2xl shadow">
      <!-- 질문 -->
      <p class="text-xl font-semibold mb-4">{{ currentQuestion.question }}</p>

      <!-- 서술형 입력 -->
      <input
        v-if="currentQuestion.type === 'text'"
        v-model="answers[currentIndex]"
        class="w-full p-3 border rounded-lg"
        placeholder="답변을 입력하세요"
      />

      <!-- 선택형 입력 -->
      <div v-if="currentQuestion.type === 'choice'" class="space-y-3">
        <button
          v-for="opt in currentQuestion.options"
          :key="opt"
          @click="selectOption(opt)"
          class="w-full p-3 border rounded-lg hover:bg-gray-100"
        >
          {{ opt }}
        </button>
      </div>

      <!-- button -->
      <button
        class="mt-6 w-full py-3 bg-sky-600 text-white text-lg rounded-lg"
        @click="nextQuestion"
        v-if="currentIndex < questions.length - 1"
      >
        다음 →
      </button>

      <!-- finish -->
      <button
        class="mt-6 w-full py-3 bg-green-600 text-white text-lg rounded-lg"
        @click="finishForm"
        v-else
      >
        문진 완료하기
      </button>
    </div>

  </div>
</template>

<script>
import departments from "@/data/departments";

export default {
  name: "TelemedicineForm",
  props: ["dept"],

  data() {
    return {
      currentIndex: 0,
      answers: {},
      // 기본 문진 질문 세트
      baseQuestions: [
        { question: "언제부터 증상이 시작되었나요?", type: "text" },
        {
          question: "증상이 얼마나 심한가요?",
          type: "choice",
          options: ["가벼움", "보통", "심함"],
        },
        {
          question: "발열이 있나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        { question: "현재 가장 불편한 점은 무엇인가요?", type: "text" },
      ]
    };
  },

  computed: {
    deptInfo() {
      return departments[this.dept];
    },

    questions() {
      // 필요 시 진료과별 추가 질문을 merge할 수도 있음
      return this.baseQuestions;
    },

    currentQuestion() {
      return this.questions[this.currentIndex];
    },
  },

  methods: {
    nextQuestion() {
      this.currentIndex++;
    },

    selectOption(opt) {
      this.answers[this.currentIndex] = opt;
      this.nextQuestion();
    },

    async finishForm() {
      const result = {
        userId: localStorage.getItem("userId"),
        department: this.dept,
        departmentName: this.deptInfo.name,
        answers: this.questions.map((q, i) => ({
          question: q.question,
          answer: this.answers[i] || "",
        })),
        createdAt: new Date().toISOString(),
      };

      // 백엔드 전송
      await fetch("http://localhost:8081/api/triage/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      // 결과 페이지로 이동
      this.$router.push({
        name: "TelemedicineResult",
        state: { summary: result },
      });
    },
  },
};
</script>
