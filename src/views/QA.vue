<template>
    <div class="min-h-screen p-6">
      <h1 class="text-3xl font-semibold mb-4">Q&A 게시판</h1>
  
      <!-- 게시글 목록 -->
      <div v-for="board in boards" :key="board.id" class="bg-gray-100 p-4 rounded-lg shadow-lg mb-4">
        <h2>{{ board.title }}</h2>
        <p>{{ board.content }}</p>
        <p>작성자: {{ board.writer }}</p>
        <p>작성일: {{ board.postedTime }}</p>
        <router-link :to="'/boards/' + board.id">상세 보기</router-link>
      </div>
  
      <!-- 새 게시글 작성 -->
      <div class="mt-8">
        <h2>새 질문 작성</h2>
        <input v-model="newBoardTitle" placeholder="제목을 입력하세요" />
        <textarea v-model="newBoardContent" placeholder="내용을 입력하세요"></textarea>
        <button @click="createBoard" class="mt-2 w-full py-2 px-4 bg-primary text-white rounded-lg">질문 올리기</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'QA',
    data() {
      return {
        boards: [], // 게시글 목록
        newBoardTitle: '',
        newBoardContent: '',
        userId: 1, // 현재 사용자 ID (로그인된 사용자)
      };
    },
    methods: {
      async fetchBoards() {
        try {
          const response = await axios.get('/api/boards');
          this.boards = response.data.content;
        } catch (error) {
          console.error('게시글을 가져오는 중 오류 발생:', error);
        }
      },
      async createBoard() {
        try {
          const boardData = {
            title: this.newBoardTitle,
            content: this.newBoardContent,
          };
          await axios.post(`/api/boards/${this.userId}`, boardData);
          this.newBoardTitle = '';
          this.newBoardContent = '';
          this.fetchBoards(); // 작성 후 목록을 다시 가져옴
        } catch (error) {
          console.error('게시글 작성 중 오류 발생:', error);
        }
      },
    },
    mounted() {
      this.fetchBoards(); // 컴포넌트가 로드될 때 게시글 목록을 가져옴
    },
  };
  </script>
  
  <style scoped>
  /* 원하는 대로 스타일을 추가하세요 */
  </style>