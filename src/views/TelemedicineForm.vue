<template>
  <div class="max-w-3xl mx-auto py-10">
    <h2 class="text-3xl font-bold mb-6">📝 AI 문진</h2>

    <div class="bg-white p-6 rounded-2xl shadow">
      
      <!-- 질문 -->
      <p class="text-xl font-semibold mb-4">
        {{ currentQuestion.question }}
      </p>

      <!-- TEXT -->
      <input
        v-if="currentQuestion.type === 'text'"
        v-model="answers[currentIndex]"
        class="w-full p-3 border rounded-lg"
        placeholder="답변을 입력하세요"
      />

      <!-- 단일 선택 -->
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

      <!-- 다중 선택 -->
      <div v-if="currentQuestion.type === 'multi'" class="space-y-3">
        <label
          v-for="opt in currentQuestion.options"
          :key="opt"
          class="flex items-center gap-2"
        >
          <input
            type="checkbox"
            :value="opt"
            v-model="answers[currentIndex]"
          />
          {{ opt }}
        </label>
      </div>

      <!-- 1~5 점수 -->
      <div v-if="currentQuestion.type === 'scale'" class="flex gap-3">
        <button
          v-for="n in 5"
          :key="n"
          @click="selectOption(n)"
          class="flex-1 py-3 border rounded-lg hover:bg-gray-100"
        >
          {{ n }} 점
        </button>
      </div>

      <!-- 버튼 -->
      <div class="mt-6 flex gap-3">

        <button
          v-if="currentIndex > 0"
          class="flex-1 py-3 bg-gray-300 text-black rounded-lg"
          @click="prevQuestion"
        >
          ← 이전
        </button>

        <button
          v-if="currentIndex < questions.length - 1"
          class="flex-1 py-3 bg-sky-600 text-white text-lg rounded-lg"
          @click="nextQuestion"
        >
          다음 →
        </button>

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

      // 실제 문진 문항 (확장 가능)
      baseQuestions: [
        { question: "언제부터 증상이 시작되었나요?", type: "text" },
        {
          question: "증상이 점점 심해지고 있나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        {
          question: "통증 정도는 어느 정도인가요?",
          type: "scale",
        },
        {
          question: "증상이 발생한 부위는 어디인가요?",
          type: "multi",
          options: ["가슴", "복부", "머리", "목/목구멍", "등/허리", "피부", "호흡기"],
        },
        {
          question: "발열이 있나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        {
          question: "호흡곤란이 있나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        {
          question: "언어장애, 의식저하, 마비 증상이 있었나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        {
          question: "증상이 갑자기 시작되었나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        {
          question: "기저질환이 있나요?",
          type: "multi",
          options: ["고혈압", "당뇨", "심장질환", "천식", "없음"],
        },
        {
          question: "최근 외상 또는 큰 스트레스가 있었나요?",
          type: "choice",
          options: ["예", "아니오"],
        },
        {
          question: "현재 가장 불편한 점은 무엇인가요?",
          type: "text",
        },
      ],
    };
  },

  computed: {
    questions() {
      return this.baseQuestions;
    },
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
  },

  methods: {
    // 이전
    prevQuestion() {
      this.currentIndex--;

      // 이전 문항이 multi인데 초기화 안 됐으면 초기화
      if (this.currentQuestion.type === "multi") {
        if (!Array.isArray(this.answers[this.currentIndex])) {
          this.answers[this.currentIndex] = [];
        }
      }
    },

    // 다음
    nextQuestion() {
      const ans = this.answers[this.currentIndex];

      if (
        ans === undefined ||
        ans === null ||
        (typeof ans === "string" && ans.trim() === "") ||
        (Array.isArray(ans) && ans.length === 0)
      ) {
        alert("답변을 입력해야 합니다.");
        return;
      }

      this.currentIndex++;

      // multi 문항 도착 시 배열 강제 초기화
      if (this.currentQuestion.type === "multi") {
        if (!Array.isArray(this.answers[this.currentIndex])) {
          this.answers[this.currentIndex] = [];
        }
      }
    },

    // 옵션 선택 (choice, scale)
    selectOption(opt) {
      this.answers[this.currentIndex] = opt;
      this.nextQuestion();
    },

    // 제출
    async finishForm() {
      // 검증
      for (let i = 0; i < this.questions.length; i++) {
        const ans = this.answers[i];
        if (!ans || (Array.isArray(ans) && ans.length === 0)) {
          alert("모든 항목에 답변해야 합니다.");
          return;
        }
      }

      const payload = {
        userId: Number(localStorage.getItem("userId")),
        department: this.dept,
        departmentName: this.dept,
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

      this.$router.push({
        name: "TelemedicineResult",
        state: { summary: data },
      });
    },
  },
};
</script>

<style scoped>
</style>
