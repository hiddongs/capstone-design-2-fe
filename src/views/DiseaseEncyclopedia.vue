<template>
  <div class="max-w-6xl mx-auto py-10 px-4">

    <!-- ⭐ 안내 박스 -->
    <div class="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
      <h2 class="text-xl font-bold text-blue-700 flex items-center gap-2">
        📘 질병 백과사전 안내
      </h2>

      <p class="text-blue-700 mt-2 leading-relaxed">
        이 페이지에서는 다양한 질환의 <strong>정의, 증상, 원인, 치료 방법</strong>을 검색하고 확인할 수 있습니다.<br />
        상단 검색창에서 질병명을 입력하거나, 아래 분류 카테고리 버튼을 눌러 조건별 탐색이 가능합니다.<br />
        목록에서 질병을 클릭하면 상세 설명을 팝업으로 확인할 수 있습니다.
      </p>

      <p class="text-xs text-blue-500 mt-2">
        ※ 정보는 의료 참고용이며, 정확한 진단은 전문의 상담을 권장합니다.
      </p>
    </div>

    <!-- HEADER / SEARCH / FILTER -->
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

      <!-- 필터 버튼 -->
      <div class="flex flex-wrap gap-2 mt-4">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectCategory(cat)"
          :class="[
            'filter-btn',
            selectedCategory === cat ? categoryStyle(cat) : 'filter-default'
          ]"
        >
          {{ cat }}
        </button>
      </div>

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

      <!-- 전체 + 카테고리 결과 -->
      <div v-else>
        <h2 class="text-xl font-semibold text-slate-700 mb-4">
          📝 {{ selectedCategory }} 질환 목록
        </h2>

        <div
          class="max-h-[600px] overflow-y-auto pr-2"
          @scroll="handleScroll"
        >
          <FilteringList
            :items="filteredDiseases"
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

      selectedCategory: "전체",
      categories: [
        "전체",
        "호흡기",
        "피부과",
        "감염병",
        "소아과",
        "소화기",
        "신경계",
        "순환기",
        "정신건강",
        "비뇨기과",
        "산부인과",
        "근골격계",
        "안과",
        "치과",
        "기타",
      ]
    };
  },

  mounted() {
    this.loadCSV();
  },

  computed: {
    filteredDiseases() {
      if (this.selectedCategory === "전체") return this.paginatedDiseases;
      return this.paginatedDiseases.filter(
        (d) => d.category === this.selectedCategory
      );
    }
  },

  methods: {
    /**  필터 카테고리 스타일 지정 */
    categoryStyle(cat) {
      const colors = {
        "호흡기": "bg-blue-500 text-white border-blue-500",
        "피부과": "bg-pink-500 text-white border-pink-500",
        "감염병": "bg-red-500 text-white border-red-500",
        "소아과": "bg-green-500 text-white border-green-500",
        "소화기": "bg-yellow-500 text-white border-yellow-500",
        "신경계": "bg-purple-500 text-white border-purple-500",
        "순환기": "bg-orange-500 text-white border-orange-500",
        "정신건강": "bg-indigo-500 text-white border-indigo-500",
        "비뇨기과": "bg-cyan-500 text-white border-cyan-500",
        "산부인과": "bg-rose-500 text-white border-rose-500",
        "근골격계": "bg-amber-600 text-white border-amber-600",
        "안과": "bg-lime-500 text-white border-lime-500",
        "치과": "bg-teal-500 text-white border-teal-500",
        "기타": "bg-gray-600 text-white border-gray-600",
      };
      return colors[cat] || "bg-sky-500 text-white";
    },

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
                category: this.autoCategory(d["질병명"])
              }));

            this.paginate();
          }
        });
      });
    },

    /** ▼  강화된 자동 카테고리 분류 */
   autoCategory(name) {
  if (!name) return "기타";
  const n = name.toLowerCase();

  // -------------------------
  // 호흡기(Respiratory)
  // -------------------------
  const respiratory = [
    "폐", "천식", "비염", "비루", "비인두", "호흡곤란", "기관지",
    "기도", "후두", "인두", "부비동", "결핵", "폐렴", "폐색", "기도염"
  ];
  if (respiratory.some(k => n.includes(k))) return "호흡기";

  // -------------------------
  // 피부과(Dermatology)
  // ------------------------
  const dermatology = [
    "피부", "습진", "두드러기", "아토피", "백선", "무좀", "진균",
    "농가진", "피부염", "건선", "피지", "모낭염"
  ];
  if (dermatology.some(k => n.includes(k))) return "피부과";

  // -------------------------
  // 감염병(Infectious)
  // -------------------------
  const infectious = [
    "감염", "염증", "바이러스", "세균", "패혈증", "간염", "헤르페스",
    "대장균", "살모넬라", "콜레라", "독성", "감염증", "결핵", "진드기"
  ];
  if (infectious.some(k => n.includes(k))) return "감염병";

  // -------------------------
  // 소아과(Pediatrics)
  // -------------------------
  const pediatric = [
    "소아", "열성", "영아", "영유아", "신생아", "소아기", "소아과",
    "수두", "홍역", "볼거리", "Rota", "로타", "수족구", "카와사키"
  ];
  if (pediatric.some(k => n.includes(k))) return "소아과";

  // -------------------------
  // 소화기(Digestive)
  // -------------------------
  const digestive = [
    "위", "장", "식도", "간", "담낭", "담도", "간성", "췌장",
    "위염", "장염", "대장", "변비", "복통", "구토", "설사", "치핵"
  ];
  if (digestive.some(k => n.includes(k))) return "소화기";

  // -------------------------
  // 신경계(Neurology)
  // -------------------------
  const neurology = [
    "뇌", "신경", "경련", "발작", "뇌증", "신경병증", "말초신경",
    "치매", "중풍", "파킨슨", "사지마비", "의식저하"
  ];
  if (neurology.some(k => n.includes(k))) return "신경계";

  // -------------------------
  //순환기(Cardiovascular)
  // -------------------------
  const cardio = [
    "심장", "심부전", "협심증", "부정맥", "심근", "동맥", "혈관",
    "고혈압", "저혈압", "혈전", "정맥", "동맥경화", "심실"
  ];
  if (cardio.some(k => n.includes(k))) return "순환기";

  // -------------------------
  // 내분비·대사
  // -------------------------
  const endocrine = [
    "당뇨", "갑상선", "부신", "호르몬", "대사", "지방", "비만",
    "고지혈증", "콜레스테롤"
  ];
  if (endocrine.some(k => n.includes(k))) return "내분비";

  // -------------------------
  // 외상·정형외과
  // -------------------------
  const ortho = [
    "골절", "탈구", "염좌", "무릎", "척추", "디스크",
    "근육", "건염", "관절"
  ];
  if (ortho.some(k => n.includes(k))) return "정형외과";

  // -------------------------
  // Default
  // -------------------------
  return "기타";
},

    selectCategory(cat) {
      this.selectedCategory = cat;
      this.currentPage = 1;
      this.paginatedDiseases = [];
      this.paginate();
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
    }
  }
};
</script>



<style scoped>
.filter-btn {
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid;
  transition: 0.2s;
}

.filter-default {
  background: white;
  color: #475569;
  border-color: #cbd5e1;
}

.filter-default:hover {
  background: #e2e8f0;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 8px;
}
</style>
