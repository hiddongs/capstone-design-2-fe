<template>
    <div class="comment-section">
      <h2 class="text-2xl font-semibold">댓글</h2>
      <form @submit.prevent="submitComment">
        <textarea v-model="newComment.content" placeholder="댓글을 입력하세요" required></textarea>
        <button type="submit" class="bg-primary hover:bg-primary-dark text-white py-2 px-4 mt-4">댓글 작성</button>
      </form>
  
      <div v-if="comments.length > 0" class="mt-8">
        <h3 class="text-xl font-semibold">댓글 목록</h3>
        <ul>
          <li v-for="comment in comments" :key="comment.id" class="mb-4 p-4 bg-base-100 shadow">
            <p>{{ comment.content }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        comments: [],
        newComment: {
          content: ''
        }
      };
    },
    methods: {
      async fetchComments() {
        const boardId = this.$route.params.boardId;
        try {
          const response = await axios.get(`http://localhost:8080/api/doctor/board/${boardId}`);
          this.comments = response.data;
        } catch (error) {
          console.error('댓글 목록을 불러오는 중 오류 발생:', error);
        }
      },
      async submitComment() {
        const boardId = this.$route.params.boardId;
        const userId = 1; // 실제 로그인된 사용자의 ID를 가져와야 합니다.
        try {
          await axios.post(`http://localhost:8080/api/doctor?userId=${userId}&boardId=${boardId}`, this.newComment);
          this.newComment.content = '';
          this.fetchComments(); // 새로운 댓글이 작성된 후 목록 갱신
        } catch (error) {
          console.error('댓글 작성 중 오류 발생:', error);
        }
      }
    },
    created() {
      this.fetchComments();
    }
  };
  </script>
  
  <style scoped>
  .comment-section {
    padding: 2rem;
  }
  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
  }
  button {
    cursor: pointer;
  }
  </style>