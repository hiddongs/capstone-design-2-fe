<template>
  <div class="write-wrapper">

    <!-- 헤더 타이틀 -->
    <h1 class="page-title">📝 의료 상담 질문 작성</h1>

    <div class="write-box">

      <!-- 제목 -->
      <div class="form-group">
        <label class="form-label">제목</label>
        <input type="text" v-model="title" class="input" placeholder="예: 두통이 3일째 지속되고 있습니다." required />
      </div>

      <!-- 내용 -->
      <div class="form-group">
        <label class="form-label">내용</label>
        <textarea v-model="content" class="textarea" placeholder="자세한 증상을 적어주세요. (언제부터, 어떤 증상, 통증 강도 등)" required></textarea>
      </div>

      <!-- 증상 선택 -->
      <div class="form-group">
        <label class="form-label">증상 선택 <span class="sub">(복수 선택 가능)</span></label>

        <div class="symptom-chips">
          <div
            v-for="sym in symptoms"
            :key="sym"
            class="chip"
            :class="{ active: symptomList.includes(sym) }"
            @click="toggleSymptom(sym)"
          >
            {{ sym }}
          </div>
        </div>
      </div>

      <!-- 진료과 선택 -->
      <div class="form-group">
        <label class="form-label">진료과 선택</label>
        <select v-model="department" class="select">
          <option disabled value="">진료과를 선택해주세요</option>
          <option v-for="dept in departments" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>
      </div>

      <!-- 익명 여부 -->
      <div class="form-group flex items-center gap-3 mt-2">
        <label class="form-label !mb-0">익명으로 문의하기</label>

        <label class="switch">
          <input type="checkbox" v-model="anonymous" />
          <span class="slider"></span>
        </label>
      </div>

      <!-- 버튼들 -->
      <button class="submit-btn" @click="createBoard">
        ✏️ 질문 등록하기
      </button>

      <button class="list-btn" @click="goToBoardList">
        📋 문의 목록 보기
      </button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      content: "",
      symptomList: [],
      department: "",
      anonymous: false,

      symptoms: ["두통", "발열", "기침", "복통", "피부 발진", "메스꺼움", "식욕 부진"],
      departments: ["내과", "외과", "정형외과", "이비인후과", "피부과", "소아과", "정신건강의학과"]
    };
  },

  methods: {
    toggleSymptom(sym) {
      if (this.symptomList.includes(sym)) {
        this.symptomList = this.symptomList.filter(s => s !== sym);
      } else {
        this.symptomList.push(sym);
      }
    },

    createBoard() {
      const userId = localStorage.getItem("userId");

      const boardData = {
        title: this.title,
        content: this.content,
        symptom: this.symptomList.join(", "),
        department: this.department,
        anonymous: this.anonymous
      };

      axios
        .post(`http://localhost:8080/api/boards/${userId}`, boardData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        })
        .then(() => {
          alert("게시글 작성 완료!");
          this.$router.push("/dashboard/board-list");
        })
        .catch(err => console.error(err));
    },

    goToBoardList() {
      this.$router.push("/dashboard/board-list");
    }
  }
};
</script>

<style scoped>
/* 전체 감싸기 */
.write-wrapper {
  max-width: 650px;
  margin: auto;
  padding: 40px 20px;
}

/* 제목 */
.page-title {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 25px;
}

/* 폼 박스 */
.write-box {
  background: #ffffff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

/* 라벨 */
.form-label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}
.sub {
  color: #64748b;
  font-size: 13px;
  margin-left: 5px;
}

/* 인풋들 */
.input,
.select,
.textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 6px;
}
.textarea {
  height: 150px;
  resize: none;
}

.form-group {
  margin-bottom: 20px;
}

/* 증상 Chips */
.symptom-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.chip {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #94a3b8;
  background: #f1f5f9;
  cursor: pointer;
  font-size: 13px;
}
.chip.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
}

/* 토글 스위치 */
.switch {
  position: relative;
  width: 46px;
  height: 24px;
  display: inline-block;
}
.switch input {
  display: none;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}
.slider:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}
input:checked + .slider {
  background: #3b82f6;
}
input:checked + .slider:before {
  transform: translateX(22px);
}

/* 버튼 */
.submit-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  padding: 14px;
  border-radius: 10px;
  margin-top: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.submit-btn:hover {
  background: #1d4ed8;
}

.list-btn {
  margin-top: 12px;
  width: 100%;
  background: #10b981;
  color: white;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
}
.list-btn:hover {
  background: #059669;
}
</style>
