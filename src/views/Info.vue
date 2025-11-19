<template>
  <div class="w-full relative">

    <!-- 🔍 검색 -->
    <div class="p-4 bg-white shadow-md flex items-center space-x-3 rounded-lg mb-4">
      <input
        v-model="keyword"
        @keyup.enter="applyFilters"
        type="text"
        placeholder="병원명, 지역, 증상 검색"
        class="flex-1 border border-gray-300 rounded-lg p-2"
      />
      <button
        @click="applyFilters"
        class="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg"
      >검색</button>

      <button
        @click="moveToUserLocation"
        class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
      >📍 현재위치</button>
    </div>

    <!-- 🏙 지역 버튼 -->
    <div class="flex flex-wrap gap-3 mb-4">
      <button class="px-4 py-2 bg-gray-300 rounded-lg" @click="resetArea">전체 지역</button>

      <button
        v-for="area in areas"
        :key="area"
        class="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg"
        @click="selectArea(area)"
      >
        {{ area }}
      </button>
    </div>

    <!-- 🩺 진료과 버튼 -->
    <div class="flex flex-wrap gap-3 mb-4">
      <button
        class="px-4 py-2 bg-gray-300 rounded-lg"
        @click="resetDepartment"
      >전체 과목</button>

      <button
        v-for="dept in departments"
        :key="dept"
        class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
        @click="selectDepartment(dept)"
      >
        {{ dept }}
      </button>
    </div>

    <!-- 🗺 지도 -->
    <div id="map" class="rounded-lg shadow-md"></div>

    <!-- ⭐ 지도 위 상세 패널 -->
    <div v-if="selectedHospital" class="hospital-panel">
      <button class="close-btn" @click="closePanel">✕</button>

      <h2 class="title">{{ selectedHospital.businessName }}</h2>

      <p class="info">📍 {{ selectedHospital.address }}</p>
      <p class="info">📞 {{ selectedHospital.phone || "정보 없음" }}</p>
      <p class="info">🩺 {{ selectedHospital.department || "정보 없음" }}</p>
      <p class="info">🏥 {{ selectedHospital.type }}</p>

      <p
        class="status"
        :class="{
          'status-normal': selectedHospital.statusDetail === '정상',
          'status-holiday': selectedHospital.statusDetail === '휴업'
        }"
      >
        ● {{ selectedHospital.statusDetail }}
      </p>
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

      markers: [],
      highlightMarker: null,

      allData: [],
      filteredData: [],

      keyword: "",
      selectedHospital: null,
      selectedArea: null,
      selectedDept: null,

      userPos: null,

      areas: ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "제주"],

      areaCenters: {
        "서울": { lat: 37.5665, lng: 126.9780 },
        "경기": { lat: 37.4363, lng: 127.5500 },
        "인천": { lat: 37.4563, lng: 126.7052 },
        "부산": { lat: 35.1796, lng: 129.0756 },
        "대구": { lat: 35.8714, lng: 128.6014 },
        "광주": { lat: 35.1595, lng: 126.8526 },
        "대전": { lat: 36.3504, lng: 127.3845 },
        "울산": { lat: 35.5384, lng: 129.3114 },
        "제주": { lat: 33.4996, lng: 126.5312 },
      },

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
    /* -------------------- 지도 스크립트 -------------------- */
    loadScript() {
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.VUE_APP_NAVER_KEY_ID}`;
      script.onload = () => {
        this.initMap();
        this.loadHospitals();
      };
      document.head.appendChild(script);
    },

    /* -------------------- 지도 초기화 -------------------- */
    initMap() {
      this.map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      });

      navigator.geolocation.getCurrentPosition((pos) => {
        this.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.map.setCenter(new naver.maps.LatLng(this.userPos.lat, this.userPos.lng));
      });

      naver.maps.Event.addListener(this.map, "idle", () => {
        this.updateMarkers();
      });
    },

    /* -------------------- 병원 데이터 로드 -------------------- */
    async loadHospitals() {
      const res = await fetch("/api/hospital/all");
      let data = await res.json();

      // 좌표 + 상태Detail(정상/휴업)만 표시
      data = data.filter(
        (h) =>
          h.x &&
          h.y &&
          (h.statusDetail === "정상" || h.statusDetail === "휴업")
      );

      this.allData = data;
      this.filteredData = data;

      this.buildClusters();
    },

    /* -------------------- 클러스터 구축 -------------------- */
    buildClusters() {
      this.supercluster = new Supercluster({
        radius: 60,
        maxZoom: 17,
      });

      const points = this.filteredData.map((h) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [h.x, h.y] },
        properties: { hospital: h },
      }));

      this.supercluster.load(points);
      this.updateMarkers();
    },

    /* -------------------- 마커 업데이트 -------------------- */
    updateMarkers() {
  if (!this.supercluster || !this.map) return;

  const zoom = this.map.getZoom();
  const bounds = this.map.getBounds();

  const clusters = this.supercluster.getClusters(
    [
      bounds.getMin().lng(),
      bounds.getMin().lat(),
      bounds.getMax().lng(),
      bounds.getMax().lat(),
    ],
    zoom
  );

  this.clearMarkers();

  let hasCluster = false; // 📌 클러스터가 하나라도 있는지 체크

  clusters.forEach((c) => {
    if (c.properties.cluster) {
      hasCluster = true;
      this.createClusterMarker(c);
    } else {
      // 일반 마커는 클러스터가 없어야 보임
      if (!hasCluster) {
        this.createHospitalMarker(c.properties.hospital);
      }
    }
  });

  // ⭐ 상세 마커 표시 조건:
  // 1) 선택된 병원 존재
  // 2) 클러스터가 없어야 함
  if (this.selectedHospital && !hasCluster) {
    this.createHospitalMarker(this.selectedHospital, true);
  }
},


    /* -------------------- 병원 마커 -------------------- */
    createHospitalMarker(hospital, forceHighlight = false) {
      const isHighlighted = forceHighlight || this.selectedHospital?.id === hospital.id;

      const color =
        hospital.statusDetail === "정상"
          ? "#00c73c"
          : "#9e9e9e"; // 휴업 = 회색

      const size = isHighlighted ? 46 : 28;
      const border = isHighlighted ? "5px solid #1e90ff" : "3px solid white";

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(hospital.y, hospital.x),
        map: this.map,
        zIndex: isHighlighted ? 999999 : 1,
        icon: {
          content: `
            <div style="
              width:${size}px;
              height:${size}px;
              background:${color};
              border-radius:50%;
              border:${border};
              transform: ${isHighlighted ? "scale(1.2)" : "scale(1)"};
              transition: 0.2s ease;
              box-shadow:0 2px 8px rgba(0,0,0,0.35);
            "></div>
          `,
          anchor: new naver.maps.Point(size / 2, size / 2),
        },
      });

      // 기존 highlightMarker 삭제
      if (isHighlighted) {
        if (this.highlightMarker) this.highlightMarker.setMap(null);
        this.highlightMarker = marker;
      }

      marker.addListener("click", () => {
        this.selectedHospital = hospital;
        this.map.setCenter(new naver.maps.LatLng(hospital.y, hospital.x));
        this.updateMarkers();
      });

      if (!isHighlighted) this.markers.push(marker);
    },

    /* -------------------- 클러스터 마커 -------------------- */
    createClusterMarker(cluster) {
      const { coordinates } = cluster.geometry;
      const count = cluster.properties.point_count;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(coordinates[1], coordinates[0]),
        map: this.map,
        icon: {
          content: `
            <div style="
              width: 42px;
              height: 42px;
              border-radius:50%;
              background:#1e90ff;
              color:white;
              display:flex;
              justify-content:center;
              align-items:center;
              font-weight:bold;
              font-size:15px;
              box-shadow:0 2px 6px rgba(0,0,0,0.25);
            ">${count}</div>
          `,
          anchor: new naver.maps.Point(21, 21),
        },
      });

      marker.addListener("click", () => {
        const zoom = this.supercluster.getClusterExpansionZoom(
          cluster.properties.cluster_id
        );
        this.map.setZoom(zoom);
        this.map.setCenter(marker.getPosition());
      });

      this.markers.push(marker);
    },

    /* -------------------- 마커 초기화 -------------------- */
    clearMarkers() {
      this.markers.forEach((m) => m.setMap(null));
      this.markers = [];
      // highlightMarker는 삭제하지 않음
    },

    /* -------------------- 필터 -------------------- */
    applyFilters() {
      let data = [...this.allData];

      if (this.keyword) {
        data = data.filter(
          (h) =>
            h.businessName.includes(this.keyword) ||
            h.address.includes(this.keyword) ||
            h.department.includes(this.keyword)
        );
      }

      if (this.selectedArea) {
        data = data.filter((h) => h.address.includes(this.selectedArea));
      }

      if (this.selectedDept) {
        data = data.filter((h) => h.department?.includes(this.selectedDept));
      }

      this.filteredData = data;
      this.buildClusters();
    },

    selectArea(area) {
      this.selectedArea = area;
      this.moveToArea(area);
      this.applyFilters();
    },

    resetArea() {
      this.selectedArea = null;
      this.applyFilters();
    },

    selectDepartment(dept) {
      this.selectedDept = dept;
      this.applyFilters();
    },

    resetDepartment() {
      this.selectedDept = null;
      this.applyFilters();
    },

    moveToArea(area) {
      const pos = this.areaCenters[area];
      if (pos) {
        this.map.setCenter(new naver.maps.LatLng(pos.lat, pos.lng));
        this.map.setZoom(12);
      }
    },

    moveToUserLocation() {
      if (!this.userPos) return;
      this.map.setCenter(new naver.maps.LatLng(this.userPos.lat, this.userPos.lng));
      this.map.setZoom(12);
    },

    closePanel() {
      this.selectedHospital = null;
      if (this.highlightMarker) this.highlightMarker.setMap(null);
      this.highlightMarker = null;
      this.updateMarkers();
    },
  },
};
</script>
<style scoped>
#map {
  width: 100%;
  height: 90vh;
  border-radius: 12px;
}

/* 상세 패널 */
.hospital-panel {
  position: fixed;
  top: 80px;
  right: 25px;
  width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  z-index: 9999;
  animation: slide-left 0.25s ease-out;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  border: none;
  cursor: pointer;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.info {
  margin-bottom: 6px;
  color: #555;
}

.status-normal {
  color: #00c73c;
}

.status-holiday {
  color: #ff9800;
}

@keyframes slide-left {
  from { transform: translateX(40px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
</style>
