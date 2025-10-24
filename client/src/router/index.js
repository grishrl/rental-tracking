import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CashFlow from '../views/CashFlow.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cashflow',
    name: 'CashFlow',
    component: CashFlow,
    meta: {
      title: 'Cash Flow Management'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router