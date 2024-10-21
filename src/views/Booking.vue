<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">방문 예약</h1>
      <form @submit.prevent="submitBooking">
        <div class="mb-4">
          <label for="hospital" class="block text-sm font-medium">병원 선택</label>
          <select v-model="selectedHospital" id="hospital" class="w-full p-2 border rounded">
            <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital">{{ hospital.name }}</option>
          </select>
        </div>
  
        <div class="mb-4">
          <label for="date" class="block text-sm font-medium">예약 날짜</label>
          <input type="date" v-model="bookingDate" id="date" class="w-full p-2 border rounded" />
        </div>
  
        <div class="mb-4">
          <label for="time" class="block text-sm font-medium">예약 시간</label>
          <input type="time" v-model="bookingTime" id="time" class="w-full p-2 border rounded" />
        </div>
  
        <button type="submit" class="py-2 px-4 bg-primary text-white rounded-lg">예약하기</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        hospitals: [
          { id: 1, name: '서울병원' },
          { id: 2, name: '강남성심병원' },
          { id: 3, name: '삼성서울병원' }
        ],
        selectedHospital: null,
        bookingDate: '',
        bookingTime: ''
      };
    },
    methods: {
      submitBooking() {
        if (!this.selectedHospital || !this.bookingDate || !this.bookingTime) {
          alert('모든 항목을 입력하세요.');
          return;
        }
        alert(`예약 완료: ${this.selectedHospital.name}, 날짜: ${this.bookingDate}, 시간: ${this.bookingTime}`);
        // 실제로는 API를 호출하여 예약 데이터를 서버로 전송
      }
    }
  };
  </script>
  
  <style scoped>
  /* 스타일 정의 */
  </style>