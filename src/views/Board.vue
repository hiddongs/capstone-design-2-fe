<template>
    <div class="board-page">
      <div class="form-container">
        <h1 class="form-title">의료 상담 문의</h1>
        <form @submit.prevent="createBoard">
          <div class="form-group">
            <label for="title" class="form-label">제목</label>
            <input type="text" v-model="title" id="title" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="content" class="form-label">내용</label>
            <textarea v-model="content" id="content" class="form-textarea" required></textarea>
          </div>
          <button type="submit" class="submit-button">작성하기</button>
        </form>
        <!-- 게시판 목록 버튼 추가 -->
        <button @click="goToBoardList" class="board-list-button">문의한 목록</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        title: '',
        content: ''
      };
    },
    methods: {
      createBoard() {
        const userId = localStorage.getItem('userId');
        const boardData = {
          title: this.title,
          content: this.content
        };
  
        axios.post(`http://localhost:8080/api/boards/${userId}`, boardData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then(() => {
          alert('게시글 작성 완료!');
          this.$router.push('/dashboard/board-list');
        })
        .catch(error => {
          console.error('게시글 작성 중 오류가 발생했습니다:', error);
        });
      },
      goToBoardList() {
        this.$router.push('/dashboard/board-list');
      }
    }
  };
  </script>
  
  <style scoped>
  .board-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
    background-color: #f9fafb;
  }
  
  .form-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 30px;
    width: 500px;
  }
  
  .form-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-label {
    font-weight: bold;
    margin-bottom: 8px;
    display: block;
    color: #555;
  }
  
  .form-input, .form-textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;
    color: #333;
  }
  
  .form-textarea {
    height: 150px;
    resize: vertical;
  }
  
  .submit-button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    width: 100%;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .submit-button:hover {
    background-color: #2980b9;
  }
  
  .board-list-button {
    margin-top: 15px;
    padding: 10px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }
  
  .board-list-button:hover {
    background-color: #27ae60;
  }
  </style>