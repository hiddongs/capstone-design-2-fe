<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">AI 비대면 진료 채팅</h1>
      <div class="chat-container p-4 bg-gray-100 rounded-md">
        <div v-for="message in chatMessages" :key="message.id" class="mb-4">
          <p><strong>{{ message.sender }}:</strong> {{ message.text }}</p>
        </div>
      </div>
  
      <div class="mt-4">
        <input v-model="newMessage" placeholder="메시지를 입력하세요" class="w-full p-2 border rounded" />
        <button @click="sendMessage" class="mt-2 w-full py-2 px-4 bg-primary text-white rounded-lg">전송</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        chatMessages: [
          { id: 1, sender: 'AI', text: '안녕하세요! 무엇을 도와드릴까요?' }
        ],
        newMessage: ''
      };
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() === '') return;
  
        // 사용자 메시지 추가
        this.chatMessages.push({ id: this.chatMessages.length + 1, sender: '사용자', text: this.newMessage });
  
        // AI 응답 (예시)
        this.chatMessages.push({ id: this.chatMessages.length + 1, sender: 'AI', text: 'AI 답변: 건강 상담 중...' });
  
        // 입력 필드 초기화
        this.newMessage = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* 스타일 정의 */
  </style>