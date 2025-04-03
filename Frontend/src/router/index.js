import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      title: 'STEEM Trail - Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'STEEM Trail - Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: 'STEEM Trail - Login'
    }
  },
  {
    path: '/daily',
    name: 'daily',
    component: () => import('../views/DailyVoteView.vue'),
    meta: {
      title: 'STEEM Trail - Daily Votes List'
    }
  },
  {
    path: '/missing',
    name: 'missing',
    component: () => import('../views/MissingVoteView.vue'),
    meta: {
      title: 'STEEM Trail - Missing Votes'
    }
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('../views/JoinView.vue'),
    meta: {
      title: 'STEEM Trail - Join'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: {
      title: 'STEEM Trail - Admin',
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard to check authentication and update page title
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title || 'STEEM Trail'
  
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const loggedIn = store.state.user?.username

  if (requiresAuth && !loggedIn) {
    // Redirect to login page with return url
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  next()
})

export default router
