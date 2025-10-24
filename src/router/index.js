import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import Qwerty from '@/components/Game2048.vue.vue'

const routes = [
  { path: '/', name: 'home', component: HelloWorld },
  { path: '/qwerty', name: 'qwerty', component: Qwerty },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
