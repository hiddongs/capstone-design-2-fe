// src/plugins/axios.js
import axios from 'axios';

// .env 파일에 정의된 환경 변수를 사용하여 기본 URL 설정
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;