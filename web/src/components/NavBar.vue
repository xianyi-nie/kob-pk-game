<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }"
        >King Of Bots</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :class="
                routeName === 'battle-index-view'
                  ? 'nav-link active'
                  : 'nav-link'
              "
              :to="{ name: 'battle-index-view' }"
              >Battle</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="
                routeName === 'records-index-view'
                  ? 'nav-link active'
                  : 'nav-link'
              "
              :to="{ name: 'records-index-view' }"
              >Records</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="
                routeName === 'ranking-index-view'
                  ? 'nav-link active'
                  : 'nav-link'
              "
              :to="{ name: 'ranking-index-view' }"
              >Ranking</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              xianyi
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'user-bot-index-view' }"
                  >My Bot</router-link
                >
              </li>

              <li><a class="dropdown-item" href="#">Exit</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const route = useRoute();
    const routeName = computed(() => route.name);

    return {
      routeName,
    };
  },
};
</script>

<style scoped></style>
