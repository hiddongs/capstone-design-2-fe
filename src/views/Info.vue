<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">병원 정보</h1>
      <ul class="space-y-4">
        <li v-for="hospital in hospitals" :key="hospital.id" class="p-4 bg-white shadow rounded-md">
          <h2 class="font-semibold">{{ hospital.name }}</h2>
          <p>{{ hospital.address }}</p>
          <p>{{ hospital.phone }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        hospitals: [
          { id: 1, name: '서울병원', address: '서울시 중구', phone: '02-123-4567' },
          { id: 2, name: '강남성심병원', address: '서울시 강남구', phone: '02-987-6543' },
          { id: 3, name: '삼성서울병원', address: '서울시 송파구', phone: '02-345-6789' }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  /* 스타일 정의 */
  </style>