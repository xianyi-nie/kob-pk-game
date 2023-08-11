<template>
  <div class="playground">
    <GameMap />
  </div>
</template>
<script>
import GameMap from '@/components/GameMap';
export default {
  components: {
    GameMap,
  },
};
</script>
<style scoped>
div.playground {
  width: 70vw;
  height: 60vh;
  margin: 40px auto;
}
</style>
