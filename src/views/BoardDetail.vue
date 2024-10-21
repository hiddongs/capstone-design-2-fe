<template>
    <div class="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ board.title }}</h1>
        <p class="text-gray-600">작성자: <span class="font-semibold">{{ maskedName(board.writer) }}</span></p>
        <p class="text-gray-600">작성 시간: {{ formatDate(board.postedTime) }}</p>
      </div>
      <div class="content">
        <p class="text-gray-700 leading-relaxed">{{ board.content }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        board: {}
      };
    },
    mounted() {
      const boardId = this.$route.params.boardId;
      this.loadBoardDetails(boardId);
    },
    methods: {
      // 게시글 상세 데이터 로드
      loadBoardDetails(boardId) {
        axios.get(`http://localhost:8080/api/boards/${boardId}`)
          .then(response => {
            this.board = response.data;
          })
          .catch(error => {
            console.error('게시글 불러오는 중 오류 발생:', error);
          });
      },
      // 작성자 이름 마스킹
      maskedName(writer) {
        if (!writer) {
          return '익명'; // 작성자 정보가 없으면 기본값 설정
        }
        
        const nameParts = writer.split('');
        
        if (nameParts.length > 1) {
          return nameParts[0] + 'XX'; // 성만 표시하고 나머지는 마스킹
        }
        return writer;
      },
      // 날짜 포맷팅
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('ko-KR', options);
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  .content p {
    line-height: 1.6;
    margin-top: 20px;
  }
  </style>