<template>
    <div class="min-h-screen flex">
      <!-- 사이드바 -->
      <aside class="w-64 bg-base-200 text-base-content p-4">
        <h2 class="text-2xl font-semibold">대시보드</h2>
        <nav class="mt-8">
          <ul>
            <li>
              <router-link to="/booking" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">
                방문 예약
              </router-link>
            </li>
            <li>
              <router-link to="/info" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">
                병원 정보
              </router-link>
            </li>
            <li>
              <router-link to="/qna" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">
                실시간 Q&A
              </router-link>
            </li>
            <li>
              <button @click="toggleAIChat" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">
                AI 채팅
              </button>
            </li>
          </ul>
        </nav>
      </aside>
  
      <!-- 메인 콘텐츠 -->
      <main class="flex-1 p-6">
        <!-- 사용자 정보 -->
        <h1 class="text-3xl font-semibold mb-4">사용자 정보</h1>
        <div class="bg-base-100 shadow rounded-lg p-4 mb-6">
          <p><strong>이름:</strong> {{ userInfo.name }}</p>
          <p><strong>이메일:</strong> {{ userInfo.email }}</p>
          <p><strong>전화번호:</strong> {{ userInfo.phone }}</p>
        </div>
  
        <!-- 병원 예약 -->
        <h1 class="text-3xl font-semibold mb-4">병원 예약</h1>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="category in categories"
            :key="category.name"
            class="p-4 bg-base-100 shadow rounded-lg text-center hover:bg-primary hover:text-white transition duration-300"
          >
            <img :src="require(`@/assets/icons/${category.icon}`)" alt="" class="w-12 h-12 mb-2 mx-auto" />
            <h3 class="text-lg">{{ category.name }}</h3>
          </div>
        </div>
  
        <!-- AI 채팅 -->
        <div v-if="showAIChat" class="mt-8">
          <h2 class="text-2xl font-semibold mb-4">AI 비대면 진료 채팅</h2>
          <div class="chat-container bg-gray-100 p-4 rounded-lg shadow-lg">
            <div v-for="message in chatMessages" :key="message.id" class="chat-box mb-4">
              <p class="font-semibold">{{ message.sender }}:</p>
              <p>{{ message.text }}</p>
            </div>
          </div>
          <div class="mt-4">
            <input v-model="newMessage" placeholder="메시지를 입력하세요" class="w-full p-2 border rounded-lg" />
            <button @click="sendMessage" class="mt-2 w-full py-2 px-4 bg-primary text-white rounded-lg">전송</button>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserDashboard',
    data() {
      return {
        showAIChat: false, // AI 채팅 기능 보이기 여부
        userInfo: {
          name: '홍길동',
          email: 'honggildong@example.com',
          phone: '010-1234-5678'
        },
        categories: [
          { name: '피부과', icon: 'skin.jpg' },
          { name: '산부인과', icon: 'obstetrics.jpg' },
          { name: '정형외과', icon: 'orthopedics.jpg' },
          { name: '성형외과', icon: 'plastic.jpg' },
          { name: '치과', icon: 'dental.jpg' },
          { name: '소아과', icon: 'pediatrics.jpg' },
          { name: '이비인후과', icon: 'ent.jpg' },
          { name: '비뇨기과', icon: 'urology.jpg' }
        ],
        chatMessages: [], // AI 채팅 메시지 리스트
        newMessage: '' // 새로 입력된 메시지
      };
    },
    methods: {
      // AI 채팅 보이기/숨기기
      toggleAIChat() {
        this.showAIChat = !this.showAIChat;
      },
      // AI 채팅 메시지 전송
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          this.chatMessages.push({ sender: '사용자', text: this.newMessage });
          // AI 응답 추가 (임시, 실제 구현 시 AI 서비스와 연동)
          this.chatMessages.push({ sender: 'AI', text: '안녕하세요, 무엇을 도와드릴까요?' });
          this.newMessage = ''; // 입력 필드 초기화
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* DaisyUI의 기본 색상과 유틸리티 클래스를 사용하므로 추가 스타일은 필요하지 않음 */
  </style>