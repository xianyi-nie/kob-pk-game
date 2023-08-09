<template>
  <div>
    <div>bot name: {{ bot_name }}</div>
    <div>bot rating: {{ bot_rating }}</div>
  </div>

  <router-view></router-view>
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';

export default {
  name: 'App',

  setup: () => {
    //函数入口
    let bot_name = ref('');
    let bot_rating = ref('');
    $.ajax({
      url: 'http://127.0.0.1:3000/pk/index/',
      type: 'GET',
      success: resp => {
        console.log(resp);
        bot_name.value = resp.name;
        bot_rating.value = resp.rating;
      },
    });
    return {
      bot_name,
      bot_rating,
    };
  },
};
</script>

<style>
body {
  background-image: url('@/assets/background.png');
  background-size: cover;
}
</style>
