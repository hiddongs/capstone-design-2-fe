<template>
    <div class="image-upload-page">
      <h2 class="text-2xl font-semibold">이미지 업로드</h2>
      <form @submit.prevent="submitImage">
        <input type="file" @change="onFileChange" required />
        <button type="submit" class="bg-primary hover:bg-primary-dark text-white py-2 px-4 mt-4">이미지 업로드</button>
      </form>
  
      <div v-if="imageUrl" class="mt-8">
        <h3 class="text-xl font-semibold">미리보기</h3>
        <img :src="imageUrl" alt="이미지 미리보기" class="mt-4" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        imageFile: null,
        imageUrl: null
      };
    },
    methods: {
      onFileChange(event) {
        this.imageFile = event.target.files[0];
      },
      async submitImage() {
        const userId = 1; // 실제 로그인된 사용자의 ID를 가져와야 합니다.
        const formData = new FormData();
        formData.append('file', this.imageFile);
        formData.append('userId', userId);
  
        try {
          const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          alert(response.data);
          this.fetchImage(response.data);  // 이미지 업로드 후 이미지 불러오기
        } catch (error) {
          console.error('이미지 업로드 중 오류 발생:', error);
        }
      },
      async fetchImage(imageId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/images/${imageId}`, {
            responseType: 'blob'
          });
          this.imageUrl = URL.createObjectURL(response.data);  // 이미지 미리보기
        } catch (error) {
          console.error('이미지를 불러오는 중 오류 발생:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .image-upload-page {
    padding: 2rem;
  }
  input {
    width: 100%;
    margin-bottom: 1rem;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  button {
    cursor: pointer;
  }
  </style>