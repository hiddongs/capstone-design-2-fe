<template>
  <div class="p-6">

    <!-- 제목 -->
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      💬 답변이 필요한 질문
    </h1>

    <!-- 안내문 -->
    <div class="bg-sky-50 border border-sky-200 p-5 rounded-xl mb-6">
      <p class="text-sky-800 text-lg font-semibold">
        아직 의사 답변이 등록되지 않은 질문들입니다.
      </p>
      <p class="text-gray-700 mt-1">
        빠르게 환자분께 도움을 주세요 😊
      </p>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="text-lg text-gray-500">
      불러오는 중입니다...
    </div>

    <!-- 데이터 없음 -->
    <div v-else-if="boards.length === 0" class="text-gray-500 text-lg">
      현재 답변을 기다리는 질문이 없습니다.
    </div>

    <!-- 게시글 리스트 -->
    <div v-else class="space-y-4">

      <div
        v-for="b in boards"
        :key="b.id"
        class="bg-white p-5 rounded-xl border shadow-md hover:bg-gray-50 transition cursor-pointer"
      >
        <div class="flex justify-between items-start">
          
          <!-- 왼쪽 내용 -->
          <div @click="goDetail(b.id)" class="flex-1">

            <!-- 제목 -->
            <p class="text-xl font-bold text-gray-800">
              {{ b.title }}
            </p>

            <!-- 작성 정보 -->
            <p class="text-sm text-gray-500 mt-1">
              ✍️ {{ b.writer }} · {{ formatDate(b.postedTime) }}
            </p>

            <!-- 태그들 -->
            <div class="flex gap-2 mt-3">
              <span class="tag">{{ b.symptom }}</span>
              <span class="tag bg-green-100 text-green-700 border-green-300">
                {{ b.department }}
              </span>
            </div>

            <!-- 내용 미리보기 -->
            <p class="text-gray-700 mt-3 line-clamp-2">
              {{ b.content || "내용 없음" }}
            </p>
          </div>

          <!-- 답변 버튼 -->
          <button
            @click="goDetail(b.id)"
            class="ml-4 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition"
          >
            답변하기 →
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "DoctorUnanswered",

  data() {
    return {
      boards: [],
      loading: true
    };
  },

  async created() {
    await this.fetchUnanswered();
  },

  methods: {
    async fetchUnanswered() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const doctorId = user?.id;

        if (!doctorId) {
          console.error("❌ doctorId 없음");
          return;
        }

        const res = await axios.get(`/api/doctor/${doctorId}/unanswered-boards`);
        this.boards = res.data;

      } catch (err) {
        console.error("❌ unanswered boards fetch error:", err);
      } finally {
        this.loading = false;
      }
    },

    goDetail(boardId) {
      this.$router.push(`/doctor/board/${boardId}`);
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
