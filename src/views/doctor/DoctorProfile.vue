<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-sky-600 mb-6">
      👤 의사 프로필
    </h1>

    <div class="bg-white p-6 rounded-xl shadow-md border">
      <p class="text-lg text-gray-700">
        <strong>이름:</strong> {{ user.name }}
      </p>

      <p class="text-lg text-gray-700">
        <strong>아이디:</strong> {{ user.username }}
      </p>

      <p class="text-lg text-gray-700">
        <strong>진료과:</strong> {{ user.department }}
      </p>

      <p class="text-lg text-gray-700">
        <strong>경력:</strong>
        {{ user.career || '미등록' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DoctorProfile",

  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || {}
    };
  }
};
</script>

<style scoped>
</style>
