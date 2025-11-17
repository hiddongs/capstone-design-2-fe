<template>
  <div class="timeline-wrapper">
    <h1 class="title">진단 기록 타임라인</h1>

    <div v-if="history.length === 0" class="empty-text">
      진단 기록이 없습니다.
    </div>

    <div v-for="item in history" :key="item.id" class="timeline-item">
      <div class="dot"></div>
      <div class="content">
        <p class="date">{{ formatDate(item.createdAt) }}</p>
        <p class="disease"><b>의심 질환:</b> {{ item.diseaseName || "없음" }}</p>
        <p class="risk"><b>위험도:</b> {{ item.severityLevel }} ({{ item.severityScore }})</p>
        <p class="symptom"><b>증상:</b> {{ item.symptom }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      history: [],   // 🔥 반드시 추가
      userId: 1,     // 로그인 연동되면 변경
    };
  },

  async mounted() {
    await this.fetchHistory();
  },

  methods: {
    // 🔥 기록 불러오기
    async fetchHistory() {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/v1/diagnosis/history?userId=${this.userId}`
        );

        this.history = res.data;   // 서버에서 받은 JSON을 그대로 타임라인에
      } catch (err) {
        console.error("히스토리 불러오기 오류:", err);
      }
    },

    // 🔥 날짜 포맷
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      return d.toLocaleString();
    },
  },
};
</script>

<style scoped>
.timeline-wrapper {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
}

.timeline-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 25px;
}

.dot {
  position: absolute;
  left: 0;
  top: 5px;
  width: 14px;
  height: 14px;
  background: #4a90e2;
  border-radius: 50%;
}

.content {
  padding: 12px;
  background: #f4f8ff;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
}

.date {
  color: #999;
  font-size: 13px;
}

.disease {
  margin-top: 6px;
  font-size: 15px;
}

.risk {
  margin-top: 4px;
  color: #d9534f;
  font-weight: bold;
}

.symptom {
  margin-top: 6px;
}

.empty-text {
  margin-top: 20px;
  color: #888;
  text-align: center;
}
</style>
