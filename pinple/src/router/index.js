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
import LoginView from '../views/LoginView.vue'
import EmailLoginView from '../views/EmailLoginView.vue'
import SignupView from '../views/SignupView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import { isLoggedIn } from '../store/auth.js'

const AUTH_ROUTES = ['login', 'login-email', 'signup']

const routes = [
  // Auth
  { path: '/login', name: 'login', component: LoginView, meta: { showNav: false } },
  { path: '/login/email', name: 'login-email', component: EmailLoginView, meta: { showNav: false } },
  { path: '/signup', name: 'signup', component: SignupView, meta: { showNav: false } },

  // App
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
  { path: '/user/:id', name: 'user-profile', component: UserProfileView, meta: { showNav: false } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (!isLoggedIn.value && !AUTH_ROUTES.includes(to.name)) {
    next({ name: 'login' })
  } else if (isLoggedIn.value && AUTH_ROUTES.includes(to.name)) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
