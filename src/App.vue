<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- 네비게이션 바 -->
    <nav class="bg-gray-800 p-4">
      <router-link to="/" class="text-white mr-4">Home</router-link>
      <router-link to="/login" class="text-white mr-4">Login</router-link>
      <router-link to="/dashboard" class="text-white">DashBoard</router-link>
    </nav>

    <!-- 라우트 컴포넌트를 렌더링할 자리 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* 기본적인 스타일링 추가 */
nav {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>