<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="disease-card"
      @click="$emit('select', item)"
    >
      <h3 class="card-title">{{ item.질병명 }}</h3>
      <p class="card-desc">
        {{ item.상세정보.slice(0, 70) }}...
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilteringList",
  props: {
    items: Array
  }
};
</script>

<style scoped>
.disease-card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: 0.2s;
}
.disease-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}
.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #0c4a6e;
}
.card-desc {
  font-size: 0.95rem;
  color: #374151;
  margin-top: 4px;
}
</style>
