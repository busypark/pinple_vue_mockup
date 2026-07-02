import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import SearchResultView from '../views/SearchResultView.vue'
import ReviewDetailView from '../views/ReviewDetailView.vue'
import RegisterView from '../views/RegisterView.vue'
import ScrapView from '../views/ScrapView.vue'
import RandomMapView from '../views/RandomMapView.vue'
import MyView from '../views/MyView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import PincrewView from '../views/PincrewView.vue'
import LikedView from '../views/LikedView.vue'
import SettingsView from '../views/SettingsView.vue'
import AccountView from '../views/AccountView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { showNav: true } },
  { path: '/search', name: 'search', component: SearchView, meta: { showNav: false } },
  { path: '/search-result', name: 'search-result', component: SearchResultView, meta: { showNav: true } },
  { path: '/review/:id', name: 'review-detail', component: ReviewDetailView, meta: { showNav: false } },
  { path: '/register/:type', name: 'register', component: RegisterView, meta: { showNav: false } },
  { path: '/scrap', name: 'scrap', component: ScrapView, meta: { showNav: true } },
  { path: '/random-map', name: 'random-map', component: RandomMapView, meta: { showNav: true } },
  { path: '/my', name: 'my', component: MyView, meta: { showNav: true } },
  { path: '/settings', name: 'settings', component: SettingsView, meta: { showNav: false } },
  { path: '/notifications', name: 'notifications', component: NotificationsView, meta: { showNav: false } },
  { path: '/pincrew', name: 'pincrew', component: PincrewView, meta: { showNav: false } },
  { path: '/liked', name: 'liked', component: LikedView, meta: { showNav: false } },
  { path: '/account', name: 'account', component: AccountView, meta: { showNav: false } },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
