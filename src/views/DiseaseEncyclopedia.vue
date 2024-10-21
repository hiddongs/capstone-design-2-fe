<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">질병 백과사전</h1>
  
      <!-- 검색 입력 -->
      <input
        type="text"
        v-model="searchQuery"
        @input="searchDisease"
        placeholder="질병명을 검색하세요"
        class="search-input mb-4"
      />
  
      <!-- 추천 목록 -->
      <div v-if="recommendedDiseases.length && searchQuery">
        <p class="font-bold">추천 질병:</p>
        <ul>
          <li
            v-for="(recommendation, index) in recommendedDiseases"
            :key="index"
            @click="selectDisease(recommendation)"
          >
            {{ recommendation['질병명'] }}
          </li>
        </ul>
      </div>
  
      <!-- 질병 목록 (스크롤을 통해 표시) -->
      <div class="disease-list-container" @scroll="handleScroll" v-if="!selectedDisease && !searchQuery">
        <ul v-if="paginatedDiseases.length">
          <li v-for="(disease, index) in paginatedDiseases" :key="index" @click="selectDisease(disease)">
            <strong>{{ disease['질병명'] }}</strong>: 
            <span>{{ disease['상세 정보'].slice(0, 50) }}...</span>
          </li>
        </ul>
      </div>
  
      <!-- 검색된 결과 -->
      <div v-if="searchResults.length && searchQuery">
        <ul>
          <li v-for="(disease, index) in searchResults" :key="index" @click="selectDisease(disease)">
            <strong>{{ disease['질병명'] }}</strong>: 
            <span>{{ disease['상세 정보'].slice(0, 50) }}...</span>
          </li>
        </ul>
      </div>
  
      <!-- 선택된 질병 상세 정보 -->
      <div v-if="selectedDisease">
        <button @click="clearSelection" class="mb-4">← 목록으로 돌아가기</button>
        <h2 class="text-xl font-bold mb-2">{{ selectedDisease['질병명'] }}</h2>
        <p>{{ selectedDisease['상세 정보'] }}</p>
      </div>
  
      <!-- 로딩 중 메시지 -->
      <div v-if="isLoading">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Papa from 'papaparse';
  
  export default {
    data() {
      return {
        diseases: [],  // 모든 질병 데이터
        paginatedDiseases: [],  // 스크롤로 표시될 질병 데이터
        pageSize: 20,  // 한 번에 표시할 항목 수
        currentPage: 1,  // 현재 페이지
        isLoading: false,  // 로딩 상태
        selectedDisease: null,  // 선택된 질병
        searchQuery: '',  // 사용자가 입력한 검색어
        searchResults: [],  // 검색 결과
        recommendedDiseases: []  // 추천 질병 목록
      };
    },
    mounted() {
      this.loadCSVData();
    },
    methods: {
      // CSV 파일 로드 및 파싱
      loadCSVData() {
        this.isLoading = true;
        axios.get('/all_disease_details.csv')
          .then(response => {
            Papa.parse(response.data, {
              header: true,
              complete: (result) => {
                this.diseases = result.data.filter(disease => disease['질병명']);
                this.paginateData();  // 첫 페이지 데이터 로드
                this.isLoading = false;
              }
            });
          })
          .catch(error => {
            console.error('CSV 파일을 읽는 중 오류 발생:', error);
            this.isLoading = false;
          });
      },
      // 페이징 처리
      paginateData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedDiseases.push(...this.diseases.slice(start, end));
      },
      // 스크롤 핸들러 (추가 데이터 로드)
      handleScroll(event) {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !this.isLoading) {
          this.currentPage++;
          this.paginateData();
        }
      },
      // 질병 선택
      selectDisease(disease) {
        this.selectedDisease = disease;
      },
      // 선택 해제
      clearSelection() {
        this.selectedDisease = null;
      },
      // 검색 기능
      searchDisease() {
        const query = this.searchQuery.toLowerCase();
        this.searchResults = this.diseases.filter(disease =>
          disease['질병명'].toLowerCase().includes(query)
        );
        this.generateRecommendations();
      },
      // 추천 기능 (유사한 질병명 추천)
      generateRecommendations() {
        const query = this.searchQuery.toLowerCase();
        if (query.length < 2) {
          this.recommendedDiseases = [];
          return;
        }
  
        this.recommendedDiseases = this.diseases.filter(disease =>
          disease['질병명'].toLowerCase().startsWith(query)
        ).slice(0, 5);  // 최대 5개의 추천 질병 표시
      }
    }
  };
  </script>
  
  <style scoped>
  .disease-list-container {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  li {
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  li:hover {
    background-color: #f0f0f0;
  }
  
  .search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  </style>