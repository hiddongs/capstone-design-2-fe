<template>
  <div class="max-w-4xl mx-auto mt-10 p-6">

    <!-- 안내 박스 -->
    <div class="p-5 mb-8 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
      <h2 class="text-xl font-bold text-blue-800 flex items-center gap-2">
        📢 의료 상담 게시판 안내
      </h2>
      <p class="text-blue-700 mt-2">
        이곳은 <strong>전문의에게 증상 관련 질문을 남기고 답변을 받을 수 있는 공간</strong>입니다.<br />
        증상 선택, 진료과 선택 기능을 통해 보다 정확한 상담이 가능합니다.
      </p>
    </div>

    <!-- 페이지 헤더 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">🩺 의료 상담 게시판</h1>

      <!-- 글쓰기 버튼 -->
      <button 
        @click="goToWrite"
        class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition">
        ✏️ 질문하기
      </button>
    </div>

    <!-- 실제 게시글 목록 -->
    <div v-if="boards.length" class="space-y-4">
      <div v-for="board in boards" :key="board.id">
        <router-link
          :to="'/dashboard/board/' + board.id"
          class="block p-5 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-200"
        >
          <!-- 제목 -->
          <p class="text-xl font-semibold text-blue-600">
            {{ board.title }}
          </p>

          <!-- 작성자 / 날짜 -->
          <p class="text-sm text-gray-600 mt-1">
            ✍️ {{ board.writer }} · 📅 {{ formatDate(board.postedTime) }}
          </p>

          <!-- 태그들 -->
          <div class="flex gap-2 mt-3">
            <span class="tag">{{ board.symptom }}</span>
            <span class="tag bg-green-100 text-green-700 border-green-300">
              {{ board.department }}
            </span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 게시글이 없을 때 샘플 질문 표시 -->
    <div v-else class="py-10 text-gray-600">

      <p class="text-xl mb-3 text-center">📝 아직 등록된 상담 질문이 없어요!</p>
      <p class="text-center mb-6">아래는 예시 질문입니다. 참고해서 첫 질문을 남겨보세요.</p>

      <!-- 샘플 목록 -->
      <div class="space-y-4">

        <div class="p-5 bg-gray-100 text-gray-600 rounded-xl border border-gray-300 cursor-default">
          <p class="font-semibold text-lg">“두통이 3일째 계속되는데 어떤 진료과를 가면 좋을까요?”</p>
          <p class="text-sm mt-1">👤 익명 · 🏥 신경과</p>
        </div>

        <div class="p-5 bg-gray-100 text-gray-600 rounded-xl border border-gray-300 cursor-default">
          <p class="font-semibold text-lg">“기침이 오래가고 가래가 같이 나오는데 폐렴일 수도 있나요?”</p>
          <p class="text-sm mt-1">👤 익명 · 🏥 호흡기내과</p>
        </div>

        <div class="p-5 bg-gray-100 text-gray-600 rounded-xl border border-gray-300 cursor-default">
          <p class="font-semibold text-lg">“음식만 먹으면 속이 쓰리고 메스꺼워요. 어떤 검사를 받아야 하나요?”</p>
          <p class="text-sm mt-1">👤 익명 · 🏥 위장내과</p>
        </div>

      </div>

      <div class="text-center mt-8">
        <button 
          @click="goToWrite" 
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition">
          ✏️ 첫 질문 작성하기
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      boards: []
    };
  },
  mounted() {
    this.loadBoardList();
  },
  methods: {
    loadBoardList() {
      axios
        .get("http://localhost:8080/api/boards")
        .then(res => {
          this.boards = res.data.content;
        })
        .catch(error => console.error(error));
    },

    goToWrite() {
      this.$router.push("/dashboard/board");
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
