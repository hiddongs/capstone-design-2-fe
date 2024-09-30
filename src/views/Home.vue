<template>
  <div>
    <!-- Hero Section -->
    <div class="hero bg-fixed bg-center" style="background-image: url('../assets/medi.jpg');">
      <div class="text-center hero-content">
        <h1 class="text-6xl font-bold text-white"></h1>
        <p class="py-10 text-xl text-gray-300">인공지능을 기반으로 한 비대면 진료 시스템</p>
        <router-link to="/login">
          <button class="btn btn-primary px-8 py-4 rounded-lg text-lg">로그인 하러가기</button>
        </router-link>
      </div>
    </div>

    <!-- Services Section -->
    <section class="section mt-10 p-8 bg-gray-100">
      <h2 class="text-center text-4xl mb-6 font-semibold text-gray-800"></h2>
      <p class="text-center max-w-2xl mx-auto mb-10 text-lg text-gray-600">
        고객들을 충족시키기 위한 더욱 혁신적인 진료 시스템
        자세한 사항은 서비스를 참고하세요!
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <!-- 서비스 1 -->
        <div class="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          <img src="../assets/ai_healthcare.jpg" alt="AI Healthcare" class="mx-auto h-40 w-40 rounded-full mb-4" />
          <h3 class="text-xl font-bold text-gray-700 mb-2">인공지능 건강 관리</h3>
          <p class="text-gray-600">AI를 통한 맞춤형 의료 지원</p>
        </div>

        <!-- 서비스 2 -->
        <div class="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          <img src="../assets/remote_consultation.jpg" alt="Remote Consultation" class="mx-auto h-40 w-40 rounded-full mb-4" />
          <h3 class="text-xl font-bold text-gray-700 mb-2">원격 상담</h3>
          <p class="text-gray-600">원격 상담을 통해 집에서도 간편하게 진료를 받을 수 있습니다!</p>
        </div>

        <!-- 서비스 3 -->
        <div class="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
          <img src="../assets/medical_reports.jpg" alt="Medical Reports" class="mx-auto h-40 w-40 rounded-full mb-4" />
          <h3 class="text-xl font-bold text-gray-700 mb-2">진단서</h3>
          <p class="text-gray-600">진단서를 더욱 쉽게 확인할 수 있습니다!</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="mt-20 p-10 bg-white">
      <h2 class="text-center text-4xl font-semibold text-gray-800 mb-12">환자의 목소리</h2>

      <div class="flex flex-col md:flex-row justify-around items-center space-y-8 md:space-y-0 md:space-x-8">
        <!-- 환자 후기 1 -->
        <div class="text-center max-w-xs">
          <img src="../assets/patient1.jpg" alt="Patient 1" class="rounded-full h-24 w-24 mx-auto mb-4" />
          <p class="italic text-gray-600">인공지능을 통한 원격 진료 시스템은 제 증산을 빠르게 확인하고 간편하게 의사에게 확인 받게 했습니다!</p>
          <p class="mt-4 font-semibold text-gray-700">Joe Danny</p>
        </div>

        <!-- 환자 후기 2 -->
        <div class="text-center max-w-xs">
          <img src="../assets/patient2.jpg" alt="Patient 2" class="rounded-full h-24 w-24 mx-auto mb-4" />
          <p class="italic text-gray-600">"의사들이 실시간으로 빠르게 상담해주니 진단이 편리했습니다!""</p>
          <p class="mt-4 font-semibold text-gray-700">- John Smith</p>
        </div>

        <!-- 환자 후기 3 -->
        <div class="text-center max-w-xs">
          <img src="../assets/patient3.jpg" alt="Patient 3" class="rounded-full h-24 w-24 mx-auto mb-4" />
          <p class="italic text-gray-600">"진단서를 가져오는 것이 너무 쉽고 시간 절약이 좋습니다!""</p>
          <p class="mt-4 font-semibold text-gray-700">- Sarah Lee</p>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="bg-blue-600 py-20 text-white text-center">
      <h2 class="text-4xl font-semibold mb-6">시작할까요?</h2>
      <p class="text-lg mb-10">우리의 웹을 선호하는 수천명의 환자들과 함께하기!</p>
      <router-link to="/signup">
        <button class="btn btn-light px-10 py-4 text-lg rounded-lg">지금 가입하기</button>
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}

.hero-content {
  color: #fff;
  text-shadow: 0px 0px 10px #000;
}

.section {
  padding: 3rem 0;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-light {
  background-color: #fff;
  color: #4f46e5;
  border: 2px solid #4f46e5;
}

.btn:hover {
  opacity: 0.9;
}

.text-gray-600 {
  color: #4a5568;
}

.text-gray-700 {
  color: #2d3748;
}

.bg-blue-600 {
  background-color: #2563eb;
}
</style>