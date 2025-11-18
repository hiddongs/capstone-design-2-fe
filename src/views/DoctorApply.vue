<template>
  <div class="max-w-xl mx-auto mt-10 bg-white shadow rounded-xl p-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">👨‍⚕️ 의사 전환 신청</h1>

    <div class="space-y-4">
      <!-- 면허번호 -->
      <div>
        <label class="block text-gray-700 mb-1">의사 면허번호</label>
        <input
          v-model="licenseNumber"
          type="text"
          placeholder="예: 12345678"
          class="w-full border rounded p-2"
        />
      </div>

      <!-- 병원 이름 -->
      <div>
        <label class="block text-gray-700 mb-1">근무 병원명</label>
        <input
          v-model="hospitalName"
          type="text"
          placeholder="예: 서울대학교병원"
          class="w-full border rounded p-2"
        />
      </div>

      <!-- 파일 업로드 -->
      <div>
        <label class="block text-gray-700 mb-1">의사 면허증 사진</label>
        <input type="file" @change="onFileChange" class="w-full border p-2 rounded" />
      </div>

      <button
        @click="openWarningModal"
        class="bg-sky-500 text-white w-full py-2 rounded hover:bg-sky-600 mt-4"
      >
        신청하기 →
      </button>
    </div>

    <!-- 결과 메시지 -->
    <p v-if="message" class="text-center mt-6 font-bold" :class="messageColor">
      {{ message }}
    </p>

    <!-- 🚨 경고 모달 -->
    <div
      v-if="showWarning"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white w-96 p-6 rounded-xl shadow-xl">
        <h2 class="text-xl font-bold text-red-600 mb-4">⚠️ 허위 신청 주의</h2>

        <p class="text-gray-700 leading-relaxed">
          의사 전환 신청은 실제 의료 면허를 보유한 사용자만 신청해야 합니다.<br /><br />
          <b class="text-red-600">
            허위로 신청할 경우 계정 정지 또는 법적 책임이 발생할 수 있습니다.
          </b><br /><br />
          제출하시겠습니까?
        </p>

        <div class="flex justify-end mt-6 space-x-2">
          <button
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="showWarning = false"
          >
            취소
          </button>

          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click="submitApplication"
          >
            확인하고 제출
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DoctorApply",

  data() {
    return {
      licenseNumber: "",
      hospitalName: "",
      file: null,
      message: "",
      messageColor: "text-green-600",
      showWarning: false,
    };
  },

  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },

    // 🔥 신청 버튼 누르면 먼저 경고 모달 표시
    openWarningModal() {
      if (!this.licenseNumber || !this.hospitalName || !this.file) {
        this.messageColor = "text-red-600";
        this.message = "모든 정보를 입력하고 파일을 첨부해주세요.";
        return;
      }
      this.showWarning = true;
    },

    // 🔥 실제 제출
    async submitApplication() {
      this.showWarning = false;

      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("licenseNumber", this.licenseNumber);
      formData.append("hospitalName", this.hospitalName);
      formData.append("file", this.file);

      try {
        await fetch("http://localhost:8080/api/doctor-apply/apply", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        });

        this.messageColor = "text-green-600";
        this.message = "의사 신청이 완료되었습니다!";
      } catch (e) {
        this.messageColor = "text-red-600";
        this.message = "신청 중 오류가 발생했습니다.";
      }
    },
  },
};
</script>

<style scoped></style>
