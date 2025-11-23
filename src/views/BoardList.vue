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

    <!-- 페이지 헤더 + 글쓰기 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">🩺 의료 상담 게시판</h1>

      <button 
        @click="goToWrite"
        class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition">
        ✏️ 질문하기
      </button>
    </div>

    <!-- 🔥 진료과 카테고리 -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button 
        v-for="dept in departments"
        :key="dept"
        @click="selectDept(dept)"
        :class="[
          'px-4 py-2 rounded-lg border transition',
          selectedDept === dept 
            ? 'bg-blue-600 text-white border-blue-700' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
      >
        {{ dept }}
      </button>

      <!-- 전체 보기 버튼 -->
      <button 
        @click="selectDept('전체')"
        :class="[
          'px-4 py-2 rounded-lg border transition',
          selectedDept === '전체'
            ? 'bg-blue-600 text-white border-blue-700'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
      >
        전체
      </button>
    </div>

    <!-- 실제 게시글 목록 -->
    <div v-if="filteredBoards.length" class="space-y-4">
      <div v-for="board in filteredBoards" :key="board.id">
        <router-link
          :to="'/dashboard/board/' + board.id"
          class="block p-5 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-200"
        >
          <p class="text-xl font-semibold text-blue-600">{{ board.title }}</p>

          <p class="text-sm text-gray-600 mt-1">
            ✍️ {{ board.writer }} · 📅 {{ formatDate(board.postedTime) }}
          </p>

          <div class="flex gap-2 mt-3">
            <span class="tag">{{ board.symptom }}</span>
            <span class="tag bg-green-100 text-green-700 border-green-300">{{ board.department }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 게시글 없음 -->
    <div v-else class="text-gray-600 py-10 text-center">
      📝 선택한 진료과에 대한 질문이 없습니다!
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      boards: [],
      selectedDept: "전체",

      // 🔥 필터 사용할 진료과 목록
      departments: [
        "내과", "외과", "소아과", "정형외과", "안과", "이비인후과",
        "신경과", "피부과", "비뇨의학과", "산부인과", "정신건강의학과"
      ]
    };
  },

  computed: {
    filteredBoards() {
      if (this.selectedDept === "전체") return this.boards;
      return this.boards.filter(
        b => b.department === this.selectedDept
      );
    }
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

    selectDept(dept) {
      this.selectedDept = dept;
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
