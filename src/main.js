

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css'; // 전역 스타일 시트 경로 확인
import './assets/styles/index.css'; // 여기에 스타일 파일을 임포트
const app = createApp(App);
app.use(router);
app.mount('#app');