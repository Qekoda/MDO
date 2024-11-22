import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const Login = () => import('../views/auth/Login.vue')
const AppealsIndex = () => import('../views/appeals/Index.vue')
const NotFound = () => import('../components/NotFound.vue')

const routes = [
  {
    path: '/login',
    // name: 'home',
    component: Login
  },
  {
    path: '/',
    name: 'appealsIndex',
    component: AppealsIndex,
    meta: { requiresAuth: true }
  },

  { path: '/:pathMatch(.*)*', name: 'not_found', component: NotFound }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!window.localStorage.getItem('authenticityToken')) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
