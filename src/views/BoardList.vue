<template>
    <div class="board-list-page">
      <h1>게시판 목록</h1>
      <ul v-if="boards.length">
        <li v-for="(board, index) in boards" :key="index">
          <router-link :to="'/dashboard/board/' + board.id">{{ board.title }} - {{ board.writer }}</router-link>
          <span>{{ formatDate(board.postedTime) }}</span>
        </li>
      </ul>
      <div v-else>
        <p>등록된 게시글이 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        boards: [] // 게시글 목록
      };
    },
    mounted() {
      this.loadBoardList();
    },
    methods: {
      loadBoardList() {
        axios.get('http://localhost:8080/api/boards')
          .then(response => {
            this.boards = response.data.content; // 서버로부터 게시글 목록을 가져옴
          })
          .catch(error => {
            console.error('게시글 목록을 불러오는 중 오류가 발생했습니다:', error);
          });
      },
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('ko-KR', options);
      }
    }
  };
  </script>
  
  <style scoped>
  .board-list-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 15px;
  }
  
  li a {
    color: #3498db;
    font-weight: bold;
  }
  
  li a:hover {
    text-decoration: underline;
  }
  
  li span {
    margin-left: 10px;
    color: #7f8c8d;
  }
  </style>