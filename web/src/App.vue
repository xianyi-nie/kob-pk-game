<template>
  <NavBar />
  <router-view></router-view>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

export default {
  components: {
    NavBar,
  },
};
</script>

<style>
body {
  background-image: url('@/assets/images/background1.jpeg');
  background-size: cover;
}
</style>
