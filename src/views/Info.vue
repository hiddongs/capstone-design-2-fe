<template>
  <div class="w-full relative">

    <!-- ⭐ 지도 안내 박스 -->
    <div class="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
      <h2 class="text-lg font-bold text-blue-800 flex items-center gap-2">
        🗺️ 병원 검색 안내
      </h2>

      <p class="text-blue-700 mt-1 leading-relaxed">
        이 페이지에서는 <strong>전국 병원을 지도 기반으로 검색</strong>할 수 있습니다.<br>
        상단 검색창에서 <strong>병원명, 지역, 증상</strong>으로 검색하거나,<br>
        아래 버튼을 통해 <strong>지역별 · 진료과별 필터링</strong>이 가능합니다.<br>
        병원 마커를 클릭하면 오른쪽에서 상세 정보를 확인할 수 있습니다.
      </p>

      <p class="text-xs text-blue-500 mt-2">
        ※ 제공되는 정보는 참고용이며 실제 병원 운영 정보와 다를 수 있습니다.
      </p>
    </div>

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
      <button class="px-4 py-2 bg-gray-300 rounded-lg" @click="resetDepartment">전체 과목</button>

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

    <!-- ⭐ 오른쪽 병원 상세 패널 -->
<div v-if="selectedHospital" class="hospital-panel">

  <!-- 닫기 버튼 -->
  <button class="close-btn" @click="closePanel">✕</button>

  <!-- 상태 뱃지 -->
 <!-- 병원명 & 상태 뱃지를 같은 줄 -->
<div class="title-row">
  <h2 class="title">{{ selectedHospital.businessName }}</h2>

</div>
  <!-- 주요 정보 -->
  <div class="info-list">
    <p><span>📍</span>{{ selectedHospital.address }}</p>
    <p><span>📞</span>{{ selectedHospital.phone || "정보 없음" }}</p>
    <p><span>🩺</span>{{ selectedHospital.department || "정보 없음" }}</p>
    
    <p><span>🏥</span>{{ selectedHospital.type }}</p>
  </div>
<p class="status-info">
  <span>
    {{ selectedHospital.statusDetail === '정상' ? '🟢' : '🚫' }}
  </span>
  {{ selectedHospital.statusDetail }}
</p>
  <!-- 운영시간 카드 -->
  <div class="op-card">
    <h3>⏰ 운영시간</h3>
    <p>{{ selectedHospital.operatingHours || "운영시간 정보 없음" }}</p>
  </div>

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

      /* 지역 버튼 */
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

      /* 진료과 버튼 */
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
    /* 네이버 지도 script 로드 */
    loadScript() {
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.VUE_APP_NAVER_KEY_ID}`;
      script.onload = () => {
        this.initMap();
        this.loadHospitals();
      };
      document.head.appendChild(script);
    },

    /* 지도 초기화 */
    initMap() {
      this.map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      });

      navigator.geolocation.getCurrentPosition((pos) => {
        this.userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.map.setCenter(new naver.maps.LatLng(this.userPos.lat, this.userPos.lng));
      });

      /* 디바운스 적용 */
      let debounceTimer = null;
      naver.maps.Event.addListener(this.map, "idle", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.updateMarkers();
        }, 200);
      });
    },

    /* 병원 데이터 */
    async loadHospitals() {
      const res = await fetch("/api/hospital/all");
      let data = await res.json();

      data = data.filter(
        (h) =>
          h.x && h.y &&
          (h.statusDetail === "정상" || h.statusDetail === "휴업")
      );

      this.allData = data;
      this.filteredData = data;

      this.buildClusters();
    },

    /* 클러스터 생성 */
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

    /* 🔥 최종 안정화된 마커 업데이트 */
    updateMarkers() {
      if (!this.map || !this.supercluster) return;

      const zoom = this.map.getZoom();
      const bounds = this.map.getBounds();

      this.clearMarkers();

      const clusters = this.supercluster.getClusters(
        [
          bounds.getMin().lng(),
          bounds.getMin().lat(),
          bounds.getMax().lng(),
          bounds.getMax().lat(),
        ],
        zoom
      );

      /* 1) 줌 13 이하 → 클러스터만 */
      if (zoom <= 13) {
        clusters.forEach(c => {
          if (c.properties.cluster) this.createClusterMarker(c);
        });
        return;
      }

      /* 2) 줌 14~15 → 클러스터 해체된 병원만 */
      if (zoom >= 14 && zoom <= 15) {
        clusters.forEach(c => {
          if (!c.properties.cluster) this.createHospitalMarker(c.properties.hospital);
        });
        return;
      }

      /* 3) 줌 16 이상 → 지도 안의 모든 병원 표시 */
      if (zoom >= 16) {
        clusters.forEach(c => {
          if (!c.properties.cluster) {
            this.createHospitalMarker(c.properties.hospital);
          }
        });

        if (this.selectedHospital) {
          this.createHospitalMarker(this.selectedHospital, true);
        }

        return;
      }
    },

    /* 병원 마커 */
    createHospitalMarker(hospital, forceHighlight = false) {
      const isHighlighted =
        forceHighlight || this.selectedHospital?.id === hospital.id;

      const color = hospital.statusDetail === "정상" ? "#00c73c" : "#9e9e9e";
      const size = isHighlighted ? 46 : 28;

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
              border:3px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.35);
              transform:${isHighlighted ? "scale(1.2)" : "scale(1)"};
              transition:0.2s ease;
            "></div>
          `,
          anchor: new naver.maps.Point(size / 2, size / 2),
        },
      });

      marker.addListener("click", () => {
        this.selectedHospital = hospital;
        this.map.setCenter(new naver.maps.LatLng(hospital.y, hospital.x));
        this.updateMarkers();
      });

      if (!isHighlighted) this.markers.push(marker);
      else this.highlightMarker = marker;
    },

    /* 클러스터 마커 */
    /* 클러스터 마커 */
/* 클러스터 마커 */
createClusterMarker(cluster) {

  const coords = cluster.geometry.coordinates;

  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(coords[1], coords[0]),
    map: this.map,
    icon: {
      content: `
        <div style="
          display:flex;
          justify-content:center;
          align-items:center;

          width:22px;
          height:22px;

          border-radius:50%;
          background:#4c8bf5;

          box-shadow:0 1px 3px rgba(0,0,0,0.25);
        ">
        </div>
      `,
      anchor: new naver.maps.Point(11, 11),
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
}
,

    /* 마커 지우기 */
    clearMarkers() {
      this.markers.forEach(m => m.setMap(null));
      this.markers = [];
    },

    /* 필터 */
    applyFilters() {
      let data = [...this.allData];

      if (this.keyword) {
        data = data.filter(
          (h) =>
            h.businessName.includes(this.keyword) ||
            h.address.includes(this.keyword) ||
            h.department?.includes(this.keyword)
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

    /* 지역 이동 */
    selectArea(area) {
      this.selectedArea = area;
      this.moveToArea(area);
      this.applyFilters();
    },

    resetArea() {
      this.selectedArea = null;
      this.applyFilters();
    },

    /* 과목 이동 */
    selectDepartment(dept) {
      this.selectedDept = dept;
      this.applyFilters();
    },

    resetDepartment() {
      this.selectedDept = null;
      this.applyFilters();
    },

    /* 지도 이동 */
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
      this.map.setZoom(13);
    },

    /* 패널 닫기 */
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

/* 오른쪽 패널 */
.hospital-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  max-height: 75vh;
  overflow-y: auto;

  background: #ffffff;
  border-radius: 16px;
  padding: 22px 20px;

  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  z-index: 9999;
  animation: fadeIn 0.25s ease;
  font-family: 'Pretendard', sans-serif;
}

/* fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* 닫기 버튼 */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.45);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* 병원명 + 상태 뱃지 라인 */
.title-row {
  display: flex;
  align-items: flex-start; /* <-- 가장 중요! */
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 병원명 */
.title {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  line-height: 1.35;
  margin: 0; /* 불필요한 margin 제거 */
  padding-right: 10px;
}
.status-info {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14.5px;
  font-weight: 600;

  color: #2ecc71; /* 기본 정상색 */
}

.status-info span {
  font-size: 16px;
}

/* 휴업일 때 자동 색상 변경 */
.status-info.holiday {
  color: #e67e22;
}


.status-badge.normal {
  background: #2ecc71;
}

.status-badge.holiday {
  background: #f39c12;
}

/* 정보 리스트 */
.info-list {
  margin-top: 6px;
  margin-bottom: 16px;
}

.info-list p {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: 14.5px;
  color: #444;
}

.info-list span {
  width: 20px;
  font-size: 17px;
  text-align: center;
  opacity: 0.9;
}

/* 운영시간 카드 */
.op-card {
  margin-top: 10px;
  background: #f7faff;
  padding: 14px 14px;
  border-radius: 12px;
  border: 1px solid #e3ebff;
}

.op-card h3 {
  font-size: 14px;
  font-weight: 700;
  color: #3b6fb8;
  margin-bottom: 6px;
}

.op-card p {
  font-size: 14px;
  color: #444;
}
</style>