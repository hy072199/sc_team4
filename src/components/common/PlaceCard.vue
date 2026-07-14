<!-- src/components/common/PlaceCard.vue -->
<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="place-card">
    <img
      v-if="item.firstimage"
      :src="item.firstimage2 || item.firstimage"
      :alt="item.title"
      class="place-image"
    />
    <div v-else class="place-image placeholder">이미지 없음</div>

    <div class="place-body">
      <h3>{{ item.title }}</h3>
      <p v-if="item.addr1">{{ item.addr1 }}</p>
      <p v-else class="no-addr">주소 정보 없음</p>
      <p v-if="item.tel">{{ item.tel }}</p>
    </div>
  </div>
</template>

<style scoped>
.place-card {
  border: 1px solid #e5e4e7;
  border-radius: 8px;
  overflow: hidden;
}
.place-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: #f4f3ec;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
.place-body {
  padding: 12px;
}
.no-addr {
  color: #999;
  font-size: 13px;
}
</style>