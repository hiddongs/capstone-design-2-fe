module.exports = {
  env: {
    browser: true, // 브라우저 환경을 설정
    es2021: true,  // ES6 이상의 문법을 사용할 수 있도록 설정
    node: true     // Node.js 환경을 설정
  },
  extends: [
    'eslint:recommended', // 권장 규칙을 사용
    'plugin:vue/vue3-essential' // Vue3 관련 규칙 사용
  ],
  parserOptions: {
    ecmaVersion: 12, // ES2021 문법을 사용 가능하도록 설정
    sourceType: 'module' // 모듈을 사용하도록 설정
  },
  rules: {
    // 사용자 정의 규칙 설정
  }
};