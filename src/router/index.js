import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/DashBoard.vue';  // 대시보드 레이아웃
import Booking from '@/views/Booking.vue';  // 방문 예약 페이지
import Info from '@/views/Info.vue';  // 병원 정보 페이지
import QnA from '@/views/QnA.vue';  // 실시간 Q&A 페이지
import AIChat from '@/views/AIChat.vue';  // AI 채팅 페이지
import DiseaseEncyclopedia from '@/views/DiseaseEncyclopedia.vue';  // 질병 백과사전 페이지

import UserInfo from '@/views/UserInfo.vue';  // 사용자 정보 페이지
import Board from '@/views/Board.vue';  // 게시글 작성 페이지
import BoardList from '@/views/BoardList.vue';  // 게시글 목록 페이지 추가
import BoardDetail from '@/views/BoardDetail.vue';  // 게시글 상세 페이지
import BookingList from '@/views/BookingList.vue';  // 병원 예약 목록

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),  // 동적 로딩
  },
  {
    path: '/signup',   // 회원가입 페이지 경로
    name: 'SignUp',
    component: () => import('@/views/SignUp.vue'), // 동적 로딩
  },
  {
    path: '/dashboard',
    component: Dashboard,  // 대시보드 레이아웃
    children: [
      { path: 'booking', name: 'Booking', component: Booking },  // 예약 페이지
      {
        path: 'booking-list',  // 경로 수정 (대시보드 내 경로로)
        name: 'BookingList',
        component: BookingList  // 병원 예약 목록 컴포넌트 등록
      },
      { path: 'info', name: 'Info', component: Info },  // 병원 정보
      { path: 'qna', name: 'QnA', component: QnA },  // Q&A 페이지
      { path: 'ai-chat', name: 'AIChat', component: AIChat },  // AI 채팅
      { path: 'disease-encyclopedia', name: 'DiseaseEncyclopedia', component: DiseaseEncyclopedia },  // 질병 백과사전
      { path: 'user-info', name: 'UserInfo', component: UserInfo },  // 사용자 정보
      { path: 'board', name: 'Board', component: Board },  // 게시판 작성 페이지
      { path: 'board-list', name: 'BoardList', component: BoardList },  // 게시판 목록 페이지 추가
      { path: 'board/:boardId', name: 'BoardDetail', component: BoardDetail },  // 게시글 상세 페이지
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),  // 로그인 페이지
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;