import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/DashBoard.vue';

import Info from '@/views/Info.vue';
import QnA from '@/views/QnA.vue';
import AIChat from '@/views/AIChat.vue';
import DiseaseEncyclopedia from '@/views/DiseaseEncyclopedia.vue';
import UserInfo from '@/views/UserInfo.vue';
import BoardWrite from '@/views/BoardWrite.vue';
import BoardList from '@/views/BoardList.vue';
import BoardDetail from '@/views/BoardDetail.vue';
import BookingList from '@/views/BookingList.vue';
import DashboardHome from '@/views/DashboardHome.vue';
import DiagnosisHistory from '@/views/DiagnosisHistory.vue';

const routes = [

  /* -------------------------
     공용 페이지
  --------------------------*/
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/SignUp.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },

  /* -------------------------
     사용자(User) 대시보드 라우트
  --------------------------*/
  {
    path: '/dashboard',
    redirect: '/dashboard/home',
    component: Dashboard,
    children: [
      /** 🔥 예약 시스템 라우트 */
      {
        path: 'telemedicine/select-doctor/:triageId',
        name: 'SelectDoctor',
        component: () => import('@/views/SelectDoctor.vue'),
        props: true,
      },
      {
        path: 'telemedicine/select-time/:doctorId/:triageId',
        name: 'SelectTime',
        component: () => import('@/views/SelectTime.vue'),
        props: true,
      },
      {
        path: 'telemedicine/complete/:bookingId',
        name: 'TelemedicineComplete',
        component: () => import('@/views/TelemedicineComplete.vue'),
        props: true,
      },

      /** 기존 telemedicine 메뉴 */
      {
        path: 'telemedicine/:dept',
        name: 'TelemedicinePage',
        component: () => import('@/views/TelemedicinePage.vue'),
        props: true,
      },
      {
        path: 'telemedicine/:dept/form',
        name: 'TelemedicineForm',
        component: () => import('@/views/TelemedicineForm.vue'),
        props: true,
      },
      {
        path: 'telemedicine/result',
        name: 'TelemedicineResult',
        component: () => import('@/views/TelemedicineResult.vue'),
      },
      {
        path: 'telemedicine/triage/:triageId',
        name: 'TriageDetail',
        component: () => import('@/views/TriageDetail.vue'),
        props: true,
      },

      /** 사용자 기타 메뉴 */
      { path: 'booking-list', name: 'BookingList', component: BookingList },
      { path: 'home', name: 'DashboardHomeVue', component: DashboardHome },
      { path: 'info', name: 'Info', component: Info },
      { path: 'qna', name: 'QnA', component: QnA },
      { path: 'ai-chat', name: 'AIChat', component: AIChat },
      { path: 'disease-encyclopedia', name: 'DiseaseEncyclopedia', component: DiseaseEncyclopedia },
      { path: 'user-info', name: 'UserInfo', component: UserInfo },
      { path: 'board', name: 'BoardWrite', component: BoardWrite },
      { path: 'board-list', name: 'BoardList', component: BoardList },
      { path: 'board/:boardId', name: 'BoardDetail', component: BoardDetail },
      { path: 'history', name: 'DiagnosisHistory', component: DiagnosisHistory },

      /* 사용자 마이페이지 */
      { path: 'mypage', name: 'UserMyPage', component: () => import('@/views/UserMyPage.vue') },
      { path: 'settings', name: 'UserSettings', component: () => import('@/views/UserSettings.vue') },
      { path: 'doctor-apply', name: 'DoctorApply', component: () => import('@/views/DoctorApply.vue') },
    ],
  },

  /* -------------------------
     🔥 의사(Doctor) 전용 라우트 추가
     /doctor 로 시작하는 모든 라우트
  --------------------------*/
  {
    path: '/doctor',
    redirect: '/doctor/dashboard',
    component: () => import('@/views/doctor/DoctorLayout.vue'),
    meta: { role: 'DOCTOR' }, // 권한 보호
    children: [
      {
        path: 'dashboard',
        name: 'DoctorDashboard',
        component: () => import('@/views/doctor/DoctorDashboard.vue'),
      },
      {
        path: 'reservations',
        name: 'DoctorReservations',
        component: () => import('@/views/doctor/DoctorReservations.vue'),
      },
      {
        path: 'triage',
        name: 'DoctorTriageList',
        component: () => import('@/views/doctor/DoctorTriageList.vue'),
      },
      {
        path: 'patient/:id',
        name: 'DoctorPatientDetail',
        component: () => import('@/views/doctor/DoctorPatientDetail.vue'),
        props: true,
      },
      {
        path: 'profile',
        name: 'DoctorProfile',
        component: () => import('@/views/doctor/DoctorProfile.vue'),
      },
      {
  path: 'triage-detail/:triageId',
  name: 'DoctorTriageDetail',
  component: () => import('@/views/doctor/DoctorTriageDetail.vue'),
  props: true,
},
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* -------------------------
   로그인 + 역할 검증 기능
--------------------------*/
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  const publicPaths = ['/', '/login', '/signup'];
  const isPublic = publicPaths.some((path) => to.path.startsWith(path));

  // 🔹 1. 비로그인 사용자는 접근 제한
  if (!token && !isPublic) {
    alert('로그인이 필요합니다.');
    return next('/login');
  }

  // 🔹 2. 의사 전용 페이지 접근 제한
  if (to.meta.role === 'DOCTOR') {
    if (!user || user.role !== 'ROLE_DOCTOR') {
      alert('의사 전용 페이지입니다.');
      return next('/dashboard/home');
    }
  }

  next();
});

export default router;
