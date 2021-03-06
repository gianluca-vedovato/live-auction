import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () =>
      import(
        /* webpackChunkName: "home" */ '../views/Home.vue'
      )
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(
        /* webpackChunkName: "login" */ '../views/Login.vue'
      )
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () =>
      import(
        /* webpackChunkName: "signup" */ '../views/Signup.vue'
      )
  },
  {
    path: '/create-user',
    name: 'CreateUser',
    component: () =>
      import(
        /* webpackChunkName: "create-user" */ '../views/CreateUser.vue'
      )
  },
  {
    path: '/account',
    name: 'User',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '../views/User.vue'
      )
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
