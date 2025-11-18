import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/DashBoard.vue';


import Info from '@/views/Info.vue';
import QnA from '@/views/QnA.vue';
import AIChat from '@/views/AIChat.vue';
import DiseaseEncyclopedia from '@/views/DiseaseEncyclopedia.vue';
import UserInfo from '@/views/UserInfo.vue';
import Board from '@/views/Board.vue';
import BoardList from '@/views/BoardList.vue';
import BoardDetail from '@/views/BoardDetail.vue';
import BookingList from '@/views/BookingList.vue';
import DashboardHome from '@/views/DashboardHome.vue';
import DiagnosisHistory from "@/views/DiagnosisHistory.vue";

const routes = [
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
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      
      { path: 'booking-list', name: 'BookingList', component: BookingList },
      { path: "home", name: 'DashboardHomeVue', component: DashboardHome },
      { path: 'info', name: 'Info', component: Info },
      { path: 'qna', name: 'QnA', component: QnA },
      { path: 'ai-chat', name: 'AIChat', component: AIChat },
      { path: 'disease-encyclopedia', name: 'DiseaseEncyclopedia', component: DiseaseEncyclopedia },
      { path: 'user-info', name: 'UserInfo', component: UserInfo },
      { path: 'board', name: 'Board', component: Board },
      { path: 'board-list', name: 'BoardList', component: BoardList },
      { path: 'board/:boardId', name: 'BoardDetail', component: BoardDetail },
      { path: 'history', name: 'DiagnosisHistory', component: DiagnosisHistory },
      {
  path: "telemedicine/:dept",
  name: "TelemedicinePage",
  component: () =>
    import("@/views/TelemedicinePage.vue"),
  props: true,
},
{
  path: "telemedicine/:dept/form",
  name: "TelemedicineForm",
  component: () => import("@/views/TelemedicineForm.vue"),
  props: true,
},
{
  path: "telemedicine/result",
  name: "TelemedicineResult",
  component: () => import("@/views/TelemedicineResult.vue"),
},
{
  path: '/dashboard/mypage',
  component: () => import('@/views/UserMyPage.vue'),
},
{
  path: 'doctor-apply',
  name: 'DoctorApply',
  component: () => import('@/views/DoctorApply.vue'),
},
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//  로그인 상태 체크
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  console.log('to:', to.path, 'name:', to.name, 'token:', token);

  const publicPaths = ['/', '/login', '/signup'];
  const isPublic = publicPaths.some(path => to.path.startsWith(path));

  if (!token && !isPublic) {
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    next('/login');
    return;
  }

  next();
});

export default router;
