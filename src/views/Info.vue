<template>
  <div class="flex flex-col h-full p-6">
    <h1 class="text-2xl font-bold mb-4">🏥 병원 검색 & 지도</h1>

    <!-- 🔍 검색창 -->
    <div class="p-4 bg-white shadow-md flex items-center space-x-3 rounded-lg">
      <input
        v-model="keyword"
        @keyup.enter="searchKeyword"
        type="text"
        placeholder="병원명 또는 증상을 입력하세요"
        class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button
        @click="searchKeyword"
        class="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg font-medium"
      >
        검색
      </button>
    </div>

    <!-- 🏷 과별 카테고리 버튼 -->
    <div class="flex flex-wrap gap-3 my-4">
      <button
        v-for="d in departments"
        :key="d"
        @click="searchDepartment(d)"
        class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold shadow-sm"
      >
        {{ d }}
      </button>
    </div>

    <!-- 🗺 지도 -->
    <div id="map" class="flex-1 mt-3 rounded-lg shadow-md"></div>
  </div>
</template>

<script>
/* global naver */

export default {
  name: "DashboardInfo",
  data() {
    return {
      map: null,
      keyword: "",
      markers: [],
      departments: [
        "이비인후과",
        "정형외과",
        "소아과",
        "내과",
        "외과",
        "피부과",
        "안과",
        "산부인과",
      ],
    };
  },

  mounted() {
    if (window.naver && window.naver.maps) {
      this.initMap();
    } else {
     const script = document.createElement("script");
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.VUE_APP_NAVER_KEY_ID}&submodules=geocoder`;

      script.onload = this.initMap;
      document.head.appendChild(script);
    }
  },

  methods: {
    initMap() {
      this.map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.9780), // 서울시청 중심
        zoom: 14,
      });
    },

    clearMarkers() {
      this.markers.forEach((m) => m.setMap(null));
      this.markers = [];
    },

    searchKeyword() {
      if (!this.keyword.trim()) {
        alert("검색어를 입력해주세요!");
        return;
      }
      this.searchHospitals(`/api/hospital/search?query=${encodeURIComponent(this.keyword)}`);
    },

    searchDepartment(dept) {
      this.searchHospitals(`/api/hospital/department?dept=${encodeURIComponent(dept)}`);
    },

    async searchHospitals(url) {
      this.clearMarkers();
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data); 
        if (!Array.isArray(data)) {
  console.error("응답이 배열이 아닙니다:", data);
  alert("서버에서 잘못된 응답을 받았습니다.");
  return;
}

data.forEach((hospital) => this.addMarker(hospital));
      } catch (error) {
        console.error("검색 오류:", error);
      }
    },

    addMarker(hospital) {
      if (!hospital.x || !hospital.y) return;

      const latlng = new naver.maps.LatLng(hospital.y, hospital.x);

      const marker = new naver.maps.Marker({
        position: latlng,
        map: this.map,
      });

      this.markers.push(marker);

      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;width:200px;">
            <strong>${hospital.businessName}</strong><br/>
            <span>${hospital.address}</span><br/>
            <span>${hospital.phone || "전화번호 정보 없음"}</span>
          </div>
        `,
      });

      naver.maps.Event.addListener(marker, "click", () =>
        infoWindow.open(this.map, marker)
      );
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 75vh;
  border-radius: 12px;
}
</style>