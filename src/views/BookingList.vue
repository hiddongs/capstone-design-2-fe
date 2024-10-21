<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">예약 목록</h1>
      <ul v-if="bookings.length">
        <li v-for="booking in bookings" :key="booking.id" class="p-4 bg-white shadow rounded-md mb-2">
          <strong>{{ booking.hospitalName }}</strong><br />
          예약 날짜: {{ booking.date }}<br />
          예약 시간: {{ booking.time }}
        </li>
      </ul>
      <p v-if="!bookings.length">예약된 병원이 없습니다.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        bookings: [], // 예약 목록
      };
    },
    mounted() {
      this.fetchBookings(); // 컴포넌트가 로드되면 예약 목록을 가져옵니다.
    },
    methods: {
      fetchBookings() {
        axios.get('http://localhost:8080/api/bookings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 사용하여 예약 목록을 요청
          }
        })
        .then(response => {
          this.bookings = response.data; // 서버에서 받아온 예약 데이터를 배열에 저장
        })
        .catch(error => {
          console.error('예약 목록을 불러오는 중 오류 발생:', error);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* 스타일 */
  </style>