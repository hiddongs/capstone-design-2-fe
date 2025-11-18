<template>
  <div class="flex h-full">
    <!-- 왼쪽 지도 -->
    <div class="flex flex-col flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4">🏥 병원 검색 & 지도</h1>

      <!-- 검색창 -->
      <div class="p-4 bg-white shadow-md flex items-center space-x-3 rounded-lg">
        <input
          v-model="keyword"
          @keyup.enter="searchKeyword"
          type="text"
          placeholder="병원명 또는 증상 입력"
          class="flex-1 border border-gray-300 rounded-lg p-2"
        />
        <button
          @click="searchKeyword"
          class="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg font-medium"
        >
          검색
        </button>
      </div>

      <!-- 과목 버튼 -->
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

      <!-- 지도 -->
      <div id="map" class="flex-1 mt-3 rounded-lg shadow-md"></div>
    </div>

    <!-- 우측 상세 패널 -->
    <div
      v-if="selectedHospital"
      class="w-80 bg-white shadow-xl p-5 border-l animate-slide-left"
    >
      <h2 class="text-xl font-bold mb-2">{{ selectedHospital.businessName }}</h2>
      <p class="text-gray-600 mb-2">📍 {{ selectedHospital.address }}</p>
      <p class="text-gray-600 mb-2">📞 {{ selectedHospital.phone || "정보 없음" }}</p>

      <button
        class="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full"
        @click="selectedHospital = null"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script>
/* global naver */

import Supercluster from "supercluster";

export default {
  data() {
    return {
      map: null,
      supercluster: null,
      rawHospitals: [],      // 모든 병원 데이터
      markers: [],           // 현재 화면에 표시 중인 마커들
      selectedHospital: null,
      keyword: "",

      departments: [
        "이비인후과", "정형외과", "소아과", "내과",
        "외과", "피부과", "안과", "산부인과"
      ],
    };
  },

  mounted() {
    this.loadScript();
  },

  methods: {
    /**  네이버 지도 로드 */
    loadScript() {
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.VUE_APP_NAVER_KEY_ID}&submodules=geocoder`;
      script.onload = () => {
        this.initMap();
        this.loadHospitals();
      };
      document.head.appendChild(script);
    },

    /**  지도 초기화 */
    initMap() {
      this.map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      });

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.map.setCenter(new naver.maps.LatLng(lat, lng));
        },
        () => console.warn("사용자 위치 가져오기 실패")
      );

      // 지도 이동/확대될 때마다 cluster 업데이트
      naver.maps.Event.addListener(this.map, "idle", () => {
        this.updateClusters();
      });
    },

    /** 전체 병원 DB 가져오기 */
    async loadHospitals() {
      const res = await fetch("/api/hospital/all");
      const data = await res.json();

      this.rawHospitals = data;

      // Supercluster 초기화
      this.supercluster = new Supercluster({
        radius: 60,
        maxZoom: 17,
      });

      const geojsonPoints = data.map((h) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [h.x, h.y],
        },
        properties: {
          hospital: h,
        },
      }));

      this.supercluster.load(geojsonPoints);

      this.updateClusters();
    },

    /** 현재 지도 범위 → Cluster 계산 후 마커 표시 */
    updateClusters() {
      if (!this.supercluster) return;

      const bounds = this.map.getBounds();
      const zoom = this.map.getZoom();

      const clusters = this.supercluster.getClusters(
        [
          bounds._min._lng,
          bounds._min._lat,
          bounds._max._lng,
          bounds._max._lat,
        ],
        Math.floor(zoom)
      );

      this.clearMarkers();

      clusters.forEach((c) => {
        if (c.properties.cluster) {
          this.createClusterMarker(c);
        } else {
          this.createHospitalMarker(c.properties.hospital);
        }
      });
    },

    /** 병원 개별 마커 */
    createHospitalMarker(h) {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(h.y, h.x),
        map: this.map,
      });

      naver.maps.Event.addListener(marker, "click", () => {
        this.selectedHospital = h;
      });

      this.markers.push(marker);
    },

    /** Supercluster 그룹 마커 */
    createClusterMarker(cluster) {
      const { coordinates } = cluster.geometry;
      const count = cluster.properties.point_count;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(coordinates[1], coordinates[0]),
        map: this.map,
        icon: {
          content: `
            <div style="
              background:#1e90ff;
              color:white;
              width:40px;
              height:40px;
              border-radius:50%;
              display:flex;
              justify-content:center;
              align-items:center;
              font-weight:bold;
              font-size:14px;
            ">${count}</div>
          `,
          anchor: new naver.maps.Point(20, 20),
        },
      });

      marker.addListener("click", () => {
        const expansionZoom = this.supercluster.getClusterExpansionZoom(cluster.properties.cluster_id);
        this.map.setZoom(expansionZoom);
        this.map.setCenter(new naver.maps.LatLng(coordinates[1], coordinates[0]));
      });

      this.markers.push(marker);
    },

    clearMarkers() {
      this.markers.forEach((m) => m.setMap(null));
      this.markers = [];
    },

    /** 검색 기능 */
    searchKeyword() {
      if (!this.keyword.trim()) return alert("검색어를 입력하세요.");
      this.searchHospitals(`/api/hospital/search?query=${encodeURIComponent(this.keyword)}`);
    },
    searchDepartment(dept) {
      this.searchHospitals(`/api/hospital/department?dept=${encodeURIComponent(dept)}`);
    },

    /** 검색 → 화면 필터링 적용 */
    async searchHospitals(url) {
      const res = await fetch(url);
      const data = await res.json();

      this.rawHospitals = data;

      // cluster 재구축
      const geojsonPoints = data.map((h) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [h.x, h.y] },
        properties: { hospital: h },
      }));

      this.supercluster.load(geojsonPoints);
      this.updateClusters();
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

@keyframes slide-left {
  from { transform: translateX(100%); }
  to { transform: translateX(0%); }
}

.animate-slide-left {
  animation: slide-left 0.25s ease-out;
}
</style>
