<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🗺 네이버 지도 예제</h1>

    <!-- 지도 -->
    <div id="map" class="w-full h-[500px] border rounded-lg"></div>
  </div>
</template>

<script>
/* global naver */
export default {
  name: "BookingView",
  mounted() {
    // 네이버 지도 스크립트 로드
   const script = document.createElement("script");
   script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
   script.async = true;
   script.onload = this.initMap;
   document.head.appendChild(script);

  },
  methods: {
    // 지도 초기화 
    initMap() {
      const mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399), // 판교 네이버 본사 좌표
        zoom: 10,
        mapTypeControl: true,
      };

      const map = new naver.maps.Map("map", mapOptions);

      // ✅ 마커 예제 (공식 가이드 참고)
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.3595704, 127.105399),
        map,
        title: "NAVER 본사",
      });

      const infoWindow = new naver.maps.InfoWindow({
        content:
          '<div style="padding:8px;font-size:14px;">📍 네이버 본사<br>경기도 성남시 분당구 불정로 6</div>',
      });

      naver.maps.Event.addListener(marker, "click", function () {
        infoWindow.open(map, marker);
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  border-radius: 10px;
}
</style>
