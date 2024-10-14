import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import DashBoard from '@/views/DashBoard.vue';
import Home from '@/views/Home.vue'; // 홈 페이지
import Board from '@/views/Board.vue'; // 게시판 페이지 추가
import Comment from '@/views/Comment.vue'; // 댓글 페이지 추가

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // 홈 페이지
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashBoard,
  },
  {
    path: '/boards',  // 게시판 경로
    name: 'Board',
    component: Board,
  },
  {
    path: '/board/:boardId/comments',  // 댓글 경로
    name: 'Comment',
    component: Comment,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;