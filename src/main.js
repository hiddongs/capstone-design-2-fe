import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import './assets/styles/index.css';
import 'animate.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
