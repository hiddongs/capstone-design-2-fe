<template>
  <div class="max-w-6xl mx-auto py-10 px-4">

    <!-- 안내 박스 -->
    <div class="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-2">
        📘 질병 백과사전 안내
      </h2>

      <p class="text-blue-700 mt-2 leading-relaxed">
        이 페이지에서는 다양한 질환의 <strong>정의, 증상, 원인, 치료 방법</strong>을 검색하고 확인할 수 있습니다.<br />
        상단 검색창에서 질병명을 입력하거나, 추천 검색어를 클릭하여 빠르게 탐색할 수 있습니다.<br />
        목록에서 질병을 클릭하면 상세 설명을 팝업으로 확인할 수 있습니다.
      </p>

      <p class="text-xs text-blue-500 mt-2">
        ※ 정보는 의료 참고용이며, 정확한 진단은 전문의 상담을 권장합니다.
      </p>
    </div>

    <!-- HEADER / SEARCH -->
    <div class="sticky top-0 bg-gray-50 pb-4 z-20">
      <h1 class="text-4xl font-bold text-sky-600 mb-6">
        📚 질병 백과사전
      </h1>

      <!-- 검색창 -->
      <input
        type="text"
        v-model="searchQuery"
        @input="searchDisease"
        placeholder="예: 감기, 폐렴, 당뇨병 등 검색"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
      />

      <!-- 추천 검색어 -->
      <div
        v-if="recommendedDiseases.length && searchQuery"
        class="mt-4 bg-white p-4 rounded-xl shadow-md border border-gray-100"
      >
        <p class="font-semibold text-sky-600 mb-2">🔎 추천 검색어</p>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="(item, idx) in recommendedDiseases"
            :key="idx"
            class="px-3 py-1 bg-sky-100 text-sky-700 rounded-full cursor-pointer text-sm hover:bg-sky-200"
            @click="selectDisease(item)"
          >
            {{ item.질병명 }}
          </span>
        </div>
      </div>
    </div>

    <!-- LIST SECTION -->
    <div v-if="!selectedDisease" class="mt-6">

      <!-- 검색 결과 -->
      <div v-if="searchQuery">
        <h2 class="text-xl font-semibold text-slate-700 mb-4">🔍 검색 결과</h2>

        <FilteringList
          :items="searchResults"
          @select="selectDisease"
        />
      </div>

      <!-- 전체 질환 목록 -->
      <div v-else>
        <h2 class="text-xl font-semibold text-slate-700 mb-4">
          📝 전체 질환 목록
        </h2>

        <div
          class="max-h-[600px] overflow-y-auto pr-2"
          @scroll="handleScroll"
        >
          <FilteringList
            :items="paginatedDiseases"
            @select="selectDisease"
          />
        </div>
      </div>
    </div>

    <!-- DETAIL MODAL -->
    <div
      v-if="selectedDisease"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50"
    >
      <div
        class="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl p-8 animate__animated animate__fadeInUp relative"
      >
        <button
          class="absolute top-4 right-4 w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center text-xl hover:bg-gray-300"
          @click="clearSelection"
        >
          ✖
        </button>

        <h2 class="text-3xl font-bold text-sky-600 mb-4">
          {{ selectedDisease.질병명 }}
        </h2>

        <p class="text-slate-700 leading-relaxed whitespace-pre-line">
          {{ selectedDisease.상세정보 }}
        </p>
      </div>
    </div>

  </div>
</template>



<script>
import axios from "axios";
import Papa from "papaparse";
import FilteringList from "./FilteringList.vue";

export default {
  name: "DiseaseEncyclopedia",
  components: { FilteringList },

  data() {
    return {
      diseases: [],
      paginatedDiseases: [],
      currentPage: 1,

      selectedDisease: null,
      searchQuery: "",
      searchResults: [],
      recommendedDiseases: [],
    };
  },

  mounted() {
    this.loadCSV();
  },

  methods: {
    loadCSV() {
      axios.get("/all_disease_details.csv").then((res) => {
        Papa.parse(res.data, {
          header: true,
          complete: (parsed) => {
            this.diseases = parsed.data
              .filter((d) => d["질병명"])
              .map((d) => ({
                질병명: d["질병명"],
                상세정보: d["상세 정보"],
              }));

            this.paginate();
          }
        });
      });
    },

    paginate() {
      const start = (this.currentPage - 1) * 20;
      const end = start + 20;
      this.paginatedDiseases.push(...this.diseases.slice(start, end));
    },

    handleScroll(e) {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        this.currentPage++;
        this.paginate();
      }
    },

    searchDisease() {
      const q = this.searchQuery.toLowerCase();
      this.searchResults = this.diseases.filter((d) =>
        d.질병명.toLowerCase().includes(q)
      );
      this.generateRecommendations();
    },

    generateRecommendations() {
      const q = this.searchQuery.toLowerCase();
      this.recommendedDiseases = this.diseases
        .filter((d) => d.질병명.toLowerCase().startsWith(q))
        .slice(0, 5);
    },

    selectDisease(d) {
      this.selectedDisease = d;
    },

    clearSelection() {
      this.selectedDisease = null;
    },
  },
};
</script>



<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 8px;
}
</style>
