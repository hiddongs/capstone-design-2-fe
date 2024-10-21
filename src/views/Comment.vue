<template>
  <div>
    <!-- Hero Section -->
    <div class="hero bg-fixed bg-center animate__animated animate__fadeIn" style="background-image: url('../assets/medi.jpg');">
      <div class="text-center hero-content">
        <h1 class="text-6xl font-bold text-white animate__animated animate__fadeInDown">AI 기반 비대면 진료</h1>
        <p class="py-10 text-xl text-gray-200 animate__animated animate__fadeInUp">인공지능을 기반으로 한 비대면 진료 시스템</p>
        <router-link to="/login">
          <button class="btn btn-primary px-8 py-4 rounded-lg text-lg hover:animate__pulse">로그인 하러가기</button>
        </router-link>
      </div>
    </div>

    <!-- Services Section -->
    <section class="section mt-10 p-8 bg-gray-50">
      <h2 class="text-center text-4xl mb-6 font-semibold text-blue-700 animate__animated animate__fadeIn">서비스</h2>
      <p class="text-center max-w-2xl mx-auto mb-10 text-lg text-gray-500 animate__animated animate__fadeInUp">
        고객들을 충족시키기 위한 더욱 혁신적인 진료 시스템
        자세한 사항은 서비스를 참고하세요!
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <!-- 서비스 1 -->
        <div class="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow animate__animated animate__zoomIn">
          <img src="../assets/ai_healthcare.jpg" alt="AI Healthcare" class="mx-auto h-40 w-40 rounded-full mb-4" />
          <h3 class="text-xl font-bold text-blue-600 mb-2">인공지능 건강 관리</h3>
          <p class="text-gray-500">AI를 통한 맞춤형 의료 지원</p>
        </div>

        <!-- 서비스 2 -->
        <div class="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow animate__animated animate__zoomIn" style="animation-delay: 0.1s;">
          <img src="../assets/remote_consultation.jpg" alt="Remote Consultation" class="mx-auto h-40 w-40 rounded-full mb-4" />
          <h3 class="text-xl font-bold text-blue-600 mb-2">원격 상담</h3>
          <p class="text-gray-500">원격 상담을 통해 집에서도 간편하게 진료를 받을 수 있습니다!</p>
        </div>

        <!-- 서비스 3 -->
        <div class="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow animate__animated animate__zoomIn" style="animation-delay: 0.2s;">
          <img src="../assets/medical_reports.jpg" alt="Medical Reports" class="mx-auto h-40 w-40 rounded-full mb-4" />
          <h3 class="text-xl font-bold text-blue-600 mb-2">진단서</h3>
          <p class="text-gray-500">진단서를 더욱 쉽게 확인할 수 있습니다!</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="mt-20 p-10 bg-white">
      <h2 class="text-center text-4xl font-semibold text-blue-700 mb-12 animate__animated animate__fadeIn">환자의 목소리</h2>

      <div class="flex flex-col md:flex-row justify-around items-center space-y-8 md:space-y-0 md:space-x-8">
        <!-- 환자 후기 1 -->
        <div class="text-center max-w-xs animate__animated animate__fadeInLeft">
          <img src="../assets/patient1.jpg" alt="Patient 1" class="rounded-full h-24 w-24 mx-auto mb-4" />
          <p class="italic text-gray-500">"AI를 통한 원격 진료 시스템 덕분에 빠르고 쉽게 진료를 받을 수 있었습니다!"</p>
          <p class="mt-4 font-semibold text-blue-600">- Joe Danny</p>
        </div>

        <!-- 환자 후기 2 -->
        <div class="text-center max-w-xs animate__animated animate__fadeInUp">
          <img src="../assets/patient2.jpg" alt="Patient 2" class="rounded-full h-24 w-24 mx-auto mb-4" />
          <p class="italic text-gray-500">"빠른 상담과 정확한 진단 덕분에 만족스러웠습니다!"</p>
          <p class="mt-4 font-semibold text-blue-600">- John Smith</p>
        </div>

        <!-- 환자 후기 3 -->
        <div class="text-center max-w-xs animate__animated animate__fadeInRight">
          <img src="../assets/patient3.jpg" alt="Patient 3" class="rounded-full h-24 w-24 mx-auto mb-4" />
          <p class="italic text-gray-500">"진단서를 쉽게 받아서 너무 편리했습니다!"</p>
          <p class="mt-4 font-semibold text-blue-600">- Sarah Lee</p>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="bg-blue-500 py-20 text-white text-center animate__animated animate__fadeInUp">
      <h2 class="text-4xl font-semibold mb-6">시작할 준비가 되셨나요?</h2>
      <p class="text-lg mb-10">수많은 환자들과 함께하는 혁신적인 의료 서비스를 경험하세요!</p>
      <router-link to="/signup">
        <button class="btn btn-light px-10 py-4 text-lg rounded-lg hover:animate__pulse">지금 가입하기</button>
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backgroundImage: require('@/assets/medi.jpg')
    }
  }
}
</script>

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
  background-color: #60a5fa; /* 밝은 파란색 */
  color: white;
}

.btn-light {
  background-color: #f0f4f8;
  color: #2563eb;
  border: 2px solid #2563eb;
}

.btn:hover {
  opacity: 0.9;
}

.text-gray-500 {
  color: #6b7280;
}

.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1e3a8a;
}

.bg-blue-500 {
  background-color: #3b82f6;
}
</style>