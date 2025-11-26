<template>
  <div class="chat-wrapper">

    <!-- 🟨 문진 입력 가이드 박스 -->
    <div class="typing-guide-box">
      <h2 class="guide-title">📝 증상 입력 가이드</h2>
      <p class="guide-text">
        AI가 보다 정확하게 분석하려면 아래 내용을 포함해 작성해 주세요:<br/><br/>
        • <b>언제부터</b> 증상이 시작되었나요?<br/>
        • <b>어디가</b> 아픈가요? (부위)<br/>
        • <b>얼마나 심한지</b> (통증 정도·빈도 등)<br/>
        • <b>동반되는 증상</b> (메스꺼움, 발열, 어지러움 등)<br/>
        • <b>위험 증상 여부</b> (호흡곤란, 마비, 의식저하 등)<br/>
        • 최근 <b>외상·운동·스트레스</b> 여부<br/><br/>
        예) "어제 밤부터 오른쪽 머리가 지끈거리고, 구역감이 조금 있습니다."
      </p>
      <p class="warn">
        ※ AI 결과는 의학적 <b>참고용</b>입니다. 응급 상황에서는 즉시 119 또는 가까운 응급실을 이용하세요.
      </p>
    </div>

    <!-- 기존 안내 박스 -->
    <div class="guide-box">
      <h2 class="guide-title">💬 AI 비대면 의료 상담 안내</h2>
      <p class="guide-text">
        이 페이지에서는 AI가 사용자의 증상을 분석하여 
        <b>의심 질환 · 위험 신호 · 병원 방문 필요 여부</b>를 안내합니다.<br/>
        증상을 직접 입력하거나, 상단의 빠른 선택 버튼을 사용해보세요.
      </p>
    </div>

    <h1 class="title">AI 비대면 진료 상담</h1>

    <!-- 증상 카테고리 버튼 -->
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

    <!-- 채팅 영역 -->
    <div ref="chatContainer" class="chat-container">
      <div v-for="message in chatMessages" :key="message.id" class="chat-row">
        <div
          :class="['chat-bubble', message.sender === 'AI' ? 'ai-bubble' : 'user-bubble']"
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
          text: "안녕하세요! 어떤 증상이 있으신가요?\n아래 가이드에 맞춰 입력하면 더 정확히 분석해드릴게요!",
          time: new Date().toLocaleTimeString(),
        },
      ],
      newMessage: "",
      loading: false,

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

      // 사용자 메시지 표시
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
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        if (!userId) {
          alert("로그인이 필요합니다.");
          return;
        }

        const res = await axios.post(
          "http://localhost:8080/api/v1/diagnosis/complete",
          null,
          { params: { userId, symptom: userMsg } }
        );

        const ai = res.data.ai;
        const risk = res.data.severityLevel;
        const score = res.data.severityScore;

        const aiMsg = `
📌 <b>의심 질환:</b> ${ai.suspectedDiseases?.join(", ") || "없음"}
⚠ <b>위험 신호:</b> ${ai.dangerSignals?.join(", ") || "없음"}
🔑 <b>추출된 키워드:</b> ${ai.extractedKeywords?.join(", ") || "없음"}

🩺 <b>응급도:</b> ${risk} (점수: ${score})

💡 <b>AI 조언</b>  
${ai.recommendations || "추천 정보 없음"}

🏥 <b>병원 권고</b>  
${ai.hospitalAdvice || "없음"}

<br/><br/>
⚠ <i>본 결과는 AI 기반 참고 정보이며, 정확한 진단은 의료진 상담이 필요합니다.</i>
`;

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
  },
};
</script>

<style scoped>
/* ============================================================
  전체 레이아웃
============================================================ */
.chat-wrapper {
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 제목 */
.title {
  font-size: 28px;
  font-weight: 700;
  margin: 25px 0 20px;
  text-align: center;
  color: #1e3a8a;
}

/* ============================================================
 문진 입력 가이드 박스
============================================================ */
.typing-guide-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 18px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(255, 200, 0, 0.15);
}

.typing-guide-box .guide-title {
  font-size: 18px;
  font-weight: 700;
  color: #b36b00;
  margin-bottom: 10px;
}

.typing-guide-box .guide-text {
  font-size: 14px;
  color: #5d4c2c;
  line-height: 1.5rem;
}

.typing-guide-box .warn {
  font-size: 12px;
  margin-top: 10px;
  color: #d46b08;
  font-weight: 600;
}

/* ============================================================
  기존 안내 박스
============================================================ */
.guide-box {
  background: #eef7ff;
  border: 1px solid #b6d8ff;
  padding: 18px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 6px rgba(0, 102, 255, 0.08);
}

.guide-box .guide-title {
  font-size: 18px;
  font-weight: 700;
  color: #0066cc;
  margin-bottom: 6px;
}

.guide-box .guide-text {
  font-size: 14px;
  color: #1e3a5f;
  line-height: 1.4rem;
}

/* ============================================================
  카테고리 버튼
============================================================ */
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
  transition: 0.2s;
}

.category-btn:hover {
  background: #dce8ff;
}

/* ============================================================
 채팅 컨테이너
============================================================ */
.chat-container {
  background: #f5f7fa;
  border-radius: 14px;
  padding: 15px;
  height: 510px;
  overflow-y: auto;
  box-shadow: inset 0px 0px 6px #c9d2df;
  margin-bottom: 15px;
}

/* 채팅 줄 */
.chat-row {
  display: flex;
  margin-bottom: 14px;
}

/* 채팅 말풍선 */
.chat-bubble {
  max-width: 75%;
  padding: 14px;
  border-radius: 12px;
  word-break: break-word;
  animation: fadeIn 0.2s ease-in-out;
}

/* AI 말풍선 */
.ai-bubble {
  background: #e1f0ff;
  border-left: 4px solid #007bff;
}

/* 사용자 말풍선 */
.user-bubble {
  background: #dcf8c6;
  margin-left: auto;
  border-right: 4px solid #34a853;
}

/* 메시지 헤더 */
.sender-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 13px;
  color: #333;
}

/* 텍스트 */
.message-text {
  font-size: 15px;
  line-height: 1.45rem;
}

/* 시간 */
.timestamp {
  font-size: 11px;
  margin-top: 6px;
  text-align: right;
  color: #777;
}

/* ============================================================
  입력 영역
============================================================ */
.input-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #bbb;
  outline: none;
  font-size: 15px;
  transition: 0.2s;
}

.chat-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px #badcff;
}

.send-btn {
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.send-btn:hover {
  background: #0056d2;
}

/* ============================================================
  로딩
============================================================ */
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

/* 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
 반응형 (모바일)
============================================================ */
@media (max-width: 600px) {
  .chat-bubble {
    max-width: 85%;
  }

  .typing-guide-box,
  .guide-box {
    padding: 12px 14px;
  }
}

</style>
