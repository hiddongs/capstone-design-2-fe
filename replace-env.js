// replace-env.js
const fs = require('fs');
const path = require('path');

// .env 파일에서 환경 변수 로드
require('dotenv').config();

const filePath = path.resolve(__dirname, './dist/index.html');

// 환경 변수를 대체할 맵
const replacements = {
    '%%VUE_APP_API_BASE_URL%%': process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
};

// index.html 파일을 읽고 환경 변수를 대체
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.error(err);

    let result = data;

    // 모든 대체할 항목을 순회하면서 파일 내에서 치환
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(key, 'g'), value);
    }

    // index.html 파일을 업데이트
    fs.writeFile(filePath, result, 'utf8', err => {
        if (err) return console.error(err);
        console.log('index.html updated with environment variables!');
    });
});