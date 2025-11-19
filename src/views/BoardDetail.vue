<template>
  <div class="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">

    <!-- 돌아가기 버튼 -->
    <button @click="$router.push('/dashboard/board-list')" 
      class="text-blue-600 hover:underline mb-4">
      ← 목록으로 돌아가기
    </button>

    <!-- 제목 -->
    <h1 class="text-3xl font-bold text-gray-800">{{ board.title }}</h1>

    <!-- 작성자 / 시간 -->
    <p class="text-gray-500 mt-1">
      작성자: {{ board.writer }} · 
      {{ formatDate(board.postedTime) }}
    </p>

    <!-- 증상 / 진료과 -->
    <div class="flex gap-2 mt-3">
      <span class="tag">{{ board.symptom }}</span>
      <span class="tag bg-green-100 text-green-700 border-green-300">
        {{ board.department }}
      </span>
    </div>

    <!-- 내용 -->
    <div class="mt-6 text-gray-700 whitespace-pre-line leading-relaxed">
      {{ board.content }}
    </div>

    <hr class="my-6">

    <!-- 💬 의사 답변 리스트 -->
    <div>
      <h2 class="text-xl font-bold mb-4">💬 의사 답변</h2>

      <div v-if="answers.length" class="space-y-4">
        <div
          v-for="answer in answers"
          :key="answer.id"
          class="p-4 bg-gray-50 border rounded-lg">
          
          <p class="text-gray-700">{{ answer.content }}</p>
          <p class="text-sm text-gray-500 mt-2">
            👨‍⚕️ 의사 ID: {{ answer.doctorId }} · 
            {{ formatDate(answer.createdTime) }}
          </p>
        </div>
      </div>

      <p v-else class="text-gray-500">아직 등록된 의사 답변이 없습니다.</p>
    </div>

    <!-- 의사일 때만 답변 입력창 표시 -->
    <div v-if="isDoctor" class="mt-8">
      <h3 class="text-lg font-semibold mb-2">🩺 의사 답변 작성</h3>

      <textarea
        v-model="answerContent"
        class="w-full border rounded-lg p-3"
        placeholder="환자에게 남길 답변을 입력하세요..."
      ></textarea>

      <button
        @click="submitAnswer"
        class="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        답변 등록하기
      </button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      board: {},
      answers: [],
      answerContent: "",
      isDoctor: false,
    };
  },

  mounted() {
    const boardId = this.$route.params.boardId;
    this.loadBoard(boardId);
    this.loadAnswers(boardId);
    this.checkDoctorRole();
  },

  methods: {
    loadBoard(id) {
      axios.get(`http://localhost:8080/api/boards/${id}`)
        .then(res => this.board = res.data)
        .catch(err => console.error(err));
    },

    loadAnswers(id) {
      axios.get(`http://localhost:8080/api/answers/board/${id}`)
        .then(res => this.answers = res.data)
        .catch(err => console.error(err));
    },

    checkDoctorRole() {
      axios.get("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      .then(res => {
        this.isDoctor = res.data.role === "DOCTOR" || res.data.role === "ADMIN";
      })
      .catch(err => console.error(err));
    },

    submitAnswer() {
      if (!this.answerContent.trim()) {
        alert("답변 내용을 입력해주세요.");
        return;
      }

      const userId = localStorage.getItem("userId");
      const boardId = this.board.id;

      axios.post(`http://localhost:8080/api/answers/${boardId}/${userId}`,
        { content: this.answerContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      )
      .then(() => {
        alert("답변이 등록되었습니다.");
        this.answerContent = "";
        this.loadAnswers(boardId);
      })
      .catch(err => console.error(err));
    },

    formatDate(date) {
      return new Date(date).toLocaleString("ko-KR");
    }
  }
};
</script>

<style scoped>
.tag {
  background: #e8f0fe;
  color: #2962ff;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid #bbdefb;
  display: inline-block;
}
</style>
