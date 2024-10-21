<template>
  <div class="min-h-screen flex">
    <!-- 사이드바 -->
    <aside class="w-64 bg-base-200 text-base-content p-4">
      <h2 class="text-2xl font-semibold">대시보드</h2>
      <nav class="mt-8">
        <ul>
          <li>
            <router-link to="/dashboard/booking" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">방문 예약</router-link>
          </li>
          <li>
            <router-link to="/dashboard/info" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">병원 정보</router-link>
          </li>
          <li>
            <router-link to="/dashboard/qna" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">실시간 Q&A</router-link>
          </li>
          <li>
            <router-link to="/dashboard/ai-chat" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">AI 채팅</router-link>
          </li>
          <li>
            <router-link to="/dashboard/disease-encyclopedia" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">질병 백과사전</router-link>
          </li>
          <li>
            <router-link to="/dashboard/user-info" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">사용자 정보</router-link>
          </li>
          <li>
            <router-link to="/dashboard/board" class="block py-2 px-4 rounded hover:bg-primary hover:text-white">의료 상담 문의</router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 메인 콘텐츠 -->
    <main class="flex-1 p-6">
      <router-view /> <!-- 하위 페이지가 여기에 로드됩니다 -->
    </main>
  </div>
</template>

<script>
export default {
  name: 'DashBoard'
};
</script>