<template>
    <div class="min-h-screen flex">
      <!-- 사이드바 -->
      <aside class="w-64 bg-base-200 text-base-content p-4">
        <h2 class="text-2xl font-semibold">대시보드</h2>
        <nav class="mt-8">
          <ul>
            <li>
              <router-link to="/booking" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">방문 예약</router-link>
            </li>
            <li>
              <router-link to="/info" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">병원 정보</router-link>
            </li>
            <li>
              <router-link to="/qna" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">실시간 Q&A</router-link>
            </li>
            <li>
              <router-link to="/ai-chat" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">AI 채팅</router-link>
            </li>
            <li>
              <router-link to="/disease-encyclopedia" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">질병 백과사전</router-link>
            </li>
          </ul>
        </nav>
      </aside>
  
      <!-- 메인 콘텐츠 -->
      <main class="flex-1 p-6">
        <router-view /> <!-- 각 라우트에 따라 컴포넌트를 표시 -->
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardLayout',
  };
  </script>
  
  <style scoped>
  /* 스타일 정의 */
  </style>