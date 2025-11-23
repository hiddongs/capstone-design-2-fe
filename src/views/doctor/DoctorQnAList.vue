<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">📚 전체 상담 게시판</h1>

    <!-- 검색 -->
    <div class="flex mb-5 gap-3">
      <input
        v-model="keyword"
        type="text"
        placeholder="제목, 내용, 증상 검색"
        class="border p-2 rounded w-72"
      />
      <button
        @click="loadBoards"
        class="px-4 py-2 bg-sky-600 text-white rounded"
      >
        검색
      </button>
    </div>

    <!-- 리스트 -->
    <div class="space-y-3">
      <div
        v-for="board in boards"
        :key="board.id"
        @click="openDetail(board.id)"
        class="p-4 bg-gray-50 rounded border hover:bg-gray-100 cursor-pointer"
      >
        <h3 class="text-lg font-semibold">{{ board.title }}</h3>
        <p class="text-gray-600 text-sm">
          작성자: {{ board.writer }} · {{ formatDate(board.postedTime) }}
        </p>
        <div class="mt-1 flex gap-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ board.symptom }}</span>
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{{ board.department }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      boards: [],
      keyword: "",
    };
  },

  mounted() {
    this.loadBoards();
  },

  methods: {
    loadBoards() {
      axios
        .get("http://localhost:8080/api/boards/search", {
          params: { keyword: this.keyword }
        })
        .then((res) => {
          this.boards = res.data;
        })
        .catch((err) => console.error(err));
    },

    openDetail(boardId) {
      this.$router.push(`/doctor/board/${boardId}`);
    },

    formatDate(dt) {
      return new Date(dt).toLocaleString("ko-KR");
    },
  },
};
</script>

<style scoped>
</style>
