<template>
  <div class="chat-wrapper">
    <h1 class="title">AI 비대면 진료 상담</h1>

    <!-- 🔥 증상 카테고리 버튼 -->
    <div class="category-buttons">
      <button
        v-for="item in categories"
        :key="item.label"
        class="category-btn"
        @click="applyCategory(item.template)"
      >
        {{ item.label }}
      </button>
    </div>

    <!-- 🔥 채팅 영역 -->
    <div ref="chatContainer" class="chat-container">
      <div v-for="message in chatMessages" :key="message.id" class="chat-row">
        <div
          :class="[
            'chat-bubble',
            message.sender === 'AI' ? 'ai-bubble' : 'user-bubble'
          ]"
          :style="message.sender === 'AI' ? severityStyle(message.severityLevel) : {}"
        >
          <p class="sender-name">{{ message.sender }}</p>
          <p class="message-text" v-html="formatMessage(message.text)"></p>
          <p class="timestamp">{{ message.time }}</p>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="loading-indicator">
        <div class="loader"></div>
        <span>AI가 분석 중...</span>
      </div>
    </div>

    <!-- 입력 영역 -->
    <div class="input-area">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="증상을 입력하세요"
        class="chat-input"
      />
      <button @click="sendMessage" class="send-btn">전송</button>
    </div>

    <!-- 🔥 위험도 높음일 때 병원 추천 팝업 -->
    <div v-if="showHospitalList" class="hospital-popup">
      <h3>⚠ 응급 위험 신호 감지 — 근처 병원 추천</h3>

      <ul class="hospital-list">
        <li v-for="(h, idx) in hospitals" :key="idx" class="hospital-item">
          <div class="hospital-name">{{ h.name }}</div>
          <div class="hospital-address">{{ h.address }}</div>
          <div class="hospital-phone">{{ h.telephone || "전화번호 없음" }}</div>
        </li>
      </ul>

      <button class="close-btn" @click="showHospitalList = false">닫기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      chatMessages: [
        {
          id: 1,
          sender: "AI",
          text: "안녕하세요! 어떤 증상이 있으신가요?\n빠른 선택 버튼을 사용해도 괜찮습니다!",
          time: new Date().toLocaleTimeString(),
        },
      ],
      newMessage: "",
      loading: false,
      showHospitalList: false,
      hospitals: [],

      // 🔥 자동 입력 버튼
      categories: [
        { label: "두통", template: "머리가 아프고 어지러워요. 구토도 조금 있습니다." },
        { label: "복통", template: "배가 콕콕 찌르듯 아프고 설사도 있습니다." },
        { label: "가슴 통증", template: "가슴이 답답하고 압박감이 느껴져요." },
        { label: "호흡곤란", template: "숨이 잘 안 쉬어지고 가슴이 쪼여오는 느낌이에요." },
        { label: "피부 발진", template: "몸에 빨간 두드러기 같은 발진이 있어요." },
      ],
    };
  },

  methods: {
    applyCategory(template) {
      this.newMessage = template;
    },

    severityStyle(level) {
      if (level === "높음") return { border: "2px solid #ff4d4f", background: "#ffe8e8" };
      if (level === "보통") return { border: "2px solid #ffa940", background: "#fff4e6" };
      return {};
    },

    formatMessage(text) {
      return text.replace(/\n/g, "<br/>");
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return;

      const userMsg = this.newMessage;

      // 사용자 메시지 추가
      this.chatMessages.push({
        id: Date.now(),
        sender: "사용자",
        text: userMsg,
        time: new Date().toLocaleTimeString(),
      });

      this.scrollToBottom();
      this.newMessage = "";
      this.loading = true;

      try {
        // 🔥 진단 API 요청
        const res = await axios.post(
          "http://localhost:8080/api/v1/diagnosis/complete",
          null,
          { params: { userId: 1, symptom: userMsg } }
        );

        const ai = res.data.ai;
        const risk = res.data.severityLevel;
        const score = res.data.severityScore;

        const suspected = ai.suspectedDiseases?.join(", ") || "없음";
        const danger = ai.dangerSignals?.join(", ") || "없음";
        const keywords = ai.extractedKeywords?.join(", ") || "없음";
        const recommendations = ai.recommendations || "추천 정보 없음";
        const hospitalAdvice = ai.hospitalAdvice || "안내 없음";

        // 🔥 AI 메시지 (확장 버전)
        const aiMsg = `
📌 <b>의심 질환:</b> ${suspected}
⚠ <b>위험 신호:</b> ${danger}
🔑 <b>추출된 주요 키워드:</b> ${keywords}

🩺 <b>응급도:</b> ${risk} (점수: ${score})

💡 <b>AI 조언</b>  
${recommendations}

🏥 <b>병원 권고</b>  
${hospitalAdvice}
`;

        // 위험도 높음 → 병원 추천
        if (risk === "높음") {
          this.fetchNearbyHospitals();
        }

        // AI 메시지 추가
        this.chatMessages.push({
          id: Date.now(),
          sender: "AI",
          text: aiMsg,
          time: new Date().toLocaleTimeString(),
          severityLevel: risk,
        });
      } finally {
        this.loading = false;
        this.scrollToBottom();
      }
    },

    // 🔥 병원 추천 API
    async fetchNearbyHospitals() {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const res = await axios.get(
          `http://localhost:8081/api/v1/diagnosis/hospitals?lat=${lat}&lng=${lng}`
        );

        this.hospitals = res.data;
        this.showHospitalList = true;
      });
    },
  },
};
</script>

<style scoped>
.chat-wrapper {
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.category-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.category-btn {
  padding: 8px 14px;
  background: #eef4ff;
  border: 1px solid #b5ccff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.category-btn:hover {
  background: #dce8ff;
}

.chat-container {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 15px;
  height: 500px;
  overflow-y: auto;
  box-shadow: inset 0px 0px 4px #ccc;
}

.chat-row {
  display: flex;
  margin-bottom: 12px;
}

.chat-bubble {
  max-width: 75%;
  padding: 12px;
  border-radius: 12px;
  word-break: break-word;
  animation: fadeIn 0.2s ease-in-out;
}

.ai-bubble {
  background: #e1f0ff;
  border-left: 4px solid #007bff;
}

.user-bubble {
  background: #dcf8c6;
  margin-left: auto;
  border-right: 4px solid #34a853;
}

.sender-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.message-text {
  font-size: 15px;
  line-height: 1.35rem;
}

.timestamp {
  font-size: 11px;
  margin-top: 6px;
  text-align: right;
  color: #777;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.chat-input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #bbb;
}

.send-btn {
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.send-btn:hover {
  background: #0056d2;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.loader {
  width: 18px;
  height: 18px;
  border: 3px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* 병원 추천 팝업 */
.hospital-popup {
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
  margin-top: 20px;
}

.hospital-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hospital-item {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.hospital-name {
  font-weight: 700;
}

.close-btn {
  margin-top: 12px;
  padding: 10px;
  background: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>
