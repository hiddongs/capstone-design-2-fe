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

      <!-- 버튼 영역 -->
      <div class="mt-6 flex gap-3">

        <!-- 뒤로가기 버튼 (첫 질문 제외) -->
        <button
          v-if="currentIndex > 0"
          class="flex-1 py-3 bg-gray-300 text-black rounded-lg"
          @click="prevQuestion"
        >
          ← 이전
        </button>

        <!-- 다음 버튼 -->
        <button
          v-if="currentIndex < questions.length - 1"
          class="flex-1 py-3 bg-sky-600 text-white text-lg rounded-lg"
          @click="nextQuestion"
        >
          다음 →
        </button>

        <!-- 완료 버튼 -->
        <button
          v-else
          class="flex-1 py-3 bg-green-600 text-white text-lg rounded-lg"
          @click="finishForm"
        >
          문진 완료하기
        </button>

      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: "TelemedicineForm",
  props: ["dept"],

  data() {
    return {
      currentIndex: 0,
      answers: {},
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
  return { name: this.dept };
},


    questions() {
      return this.baseQuestions;
    },

    currentQuestion() {
      return this.questions[this.currentIndex];
    },
  },

  methods: {

    // ✔ 이전 문항으로 이동
    prevQuestion() {
      this.currentIndex--;
    },

    // ✔ 다음 문항으로 이동하기 전에 빈칸 체크
    nextQuestion() {
      const currentAnswer = this.answers[this.currentIndex];

      if (!currentAnswer || currentAnswer.trim() === "") {
        alert("답변을 입력해야 다음으로 진행할 수 있습니다.");
        return;
      }

      this.currentIndex++;
    },

    selectOption(opt) {
      this.answers[this.currentIndex] = opt;
      this.nextQuestion();
    },

    // ✔ 최종 제출 전 전체 검증
    async finishForm() {
      for (let i = 0; i < this.questions.length; i++) {
        if (!this.answers[i] || this.answers[i].trim() === "") {
          alert("모든 질문에 답변해야 문진을 완료할 수 있습니다.");
          return;
        }
      }

      const payload = {
        userId: Number(localStorage.getItem("userId")),

        department: this.dept,
        departmentName: this.deptInfo.name,
        answers: this.questions.map((q, i) => ({
          question: q.question,
          answer: this.answers[i],
        })),
      };

      const response = await fetch("http://localhost:8080/api/triage/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
sessionStorage.setItem("teleSummary", JSON.stringify(data));
      // 결과 페이지 이동
      this.$router.push({
        name: "TelemedicineResult",
        state: { summary: data },
      });
    },
  },
};
</script>
