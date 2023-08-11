import { createRouter, createWebHistory } from 'vue-router';
import BattleIndexView from '../views/battles/BattleIndexView.vue';
import RecordsIndexView from '../views/records/RecordsIndexView.vue';
import RankingIndexView from '../views/ranking/RankingIndexView.vue';
import UserBotIndexView from '../views/user/bot/UserBotIndexView.vue';
import NotFound from '../views/error/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/battle/',
  },
  {
    path: '/battle/',
    name: 'battle-index-view',
    component: BattleIndexView,
  },
  {
    path: '/records/',
    name: 'records-index-view',
    component: RecordsIndexView,
  },
  {
    path: '/ranking/',
    name: 'ranking-index-view',
    component: RankingIndexView,
  },
  {
    path: '/user/bot/',
    name: 'user-bot-index-view',
    component: UserBotIndexView,
  },
  {
    path: '/404/',
    name: '404',
    component: NotFound,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
