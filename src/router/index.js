import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemCongDan from '@/views/congdan/ThemCongDan.vue'
import SuaCongDan from '@/views/congdan/SuaCongDan.vue'
import DSCongDan from '@/views/congdan/DSCongDan.vue'
import DSHoso from '@/views/hoso/DSHoso.vue'
import ThemHoso from '@/views/hoso/ThemHoso.vue'
import DSKythi from '@/views/kythi/DSKythi.vue'
import ThemKythi from '@/views/kythi/ThemKythi.vue'
import ThemHosoKythi from '@/views/kythi/ThemHosoKythi.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cong-dan',
      name: 'DSCongDan',
      component: DSCongDan,
    },
    {
      path: '/cong-dan/them-moi',
      name: 'ThemCongDan',
      component: ThemCongDan,
    },
    {
      path: '/cong-dan/chinh-sua/:id',
      name: 'SuaCongDan',
      component: SuaCongDan,
    },
    {
      path: '/ho-so',
      name: 'DSHoSo',
      component: DSHoso,
    },
    {
      path: '/ho-so/them-moi',
      name: 'ThemHoSo',
      component: ThemHoso,
    },
    {
      path: '/ky-thi',
      name: 'KyThi',
      component: DSKythi,
    },
    {
      path: '/ky-thi/them',
      name: 'ThemKyThi',
      component: ThemKythi,
    },
    {
      path: '/ky-thi/:id/them-ho-so',
      name: 'ThemHoSoKyThi',
      component: ThemHosoKythi,
    },
  ],
})

export default router
