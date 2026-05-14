import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        guestOnly: true,
      },
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/Error403.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/cong-dan',
      name: 'DSCongDan',
      component: () => import('@/views/congdan/DSCongDan.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_HO_SO',
      },
    },
    {
      path: '/cong-dan/them-moi',
      name: 'ThemCongDan',
      component: () => import('@/views/congdan/ThemCongDan.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_HO_SO',
      },
    },
    {
      path: '/cong-dan/chinh-sua/:id',
      name: 'SuaCongDan',
      component: () => import('@/views/congdan/SuaCongDan.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_HO_SO',
      },
    },
    {
      path: '/ho-so',
      name: 'DSHoSo',
      component: () => import('@/views/hoso/DSHoso.vue'),
      meta: {
        requiresAuth: true,
        permissions: ['QUAN_LY_HO_SO', 'DUYET_HO_SO'],
      },
    },
    {
      path: '/ho-so/them-moi',
      name: 'ThemHoSo',
      component: () => import('@/views/hoso/ThemHoso.vue'),
      meta: {
        requiresAuth: true,
        permissions: ['QUAN_LY_HO_SO', 'DUYET_HO_SO'],
      },
    },
    {
      path: '/ky-thi',
      name: 'KyThi',
      component: () => import('@/views/kythi/DSKythi.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_KY_THI',
      },
    },
    {
      path: '/ky-thi/them',
      name: 'ThemKyThi',
      component: () => import('@/views/kythi/ThemKythi.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_KY_THI',
      },
    },
    {
      path: '/ky-thi/:id/them-ho-so',
      name: 'ThemHoSoKyThi',
      component: () => import('@/views/kythi/ThemHosoKythi.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_KY_THI',
      },
    },
    {
      path: '/ket-qua',
      name: 'KetQua',
      component: () => import('@/views/ketqua/KetquaView.vue'),
      meta: {
        requiresAuth: true,
        permission: 'NHAP_KET_QUA_THI',
      },
    },
    {
      path: '/giay-phep',
      name: 'DSGiayPhep',
      component: () => import('@/views/giayphep/DSGiayPhep.vue'),
      meta: {
        requiresAuth: true,
        permission: 'CAP_GPLX',
      },
    },
    {
      path: '/giay-phep/chi-tiet/:id',
      name: 'ChiTietGiayPhep',
      component: () => import('@/views/giayphep/ChiTietGiayPhep.vue'),
      meta: {
        requiresAuth: true,
        permission: 'CAP_GPLX',
      },
    },
    {
      path: '/can-bo',
      name: 'can-bo',
      component: () => import('@/views/canbo/DSCanBo.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_CAN_BO',
      },
    },
    {
      path: '/can-bo/them',
      name: 'them-can-bo',
      component: () => import('@/views/canbo/CanBoForm.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_CAN_BO',
      },
    },
    {
      path: '/can-bo/sua/:publicId',
      name: 'sua-can-bo',
      component: () => import('@/views/canbo/CanBoForm.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_CAN_BO',
      },
    },
    {
      path: '/can-bo/phan-quyen/:publicId',
      name: 'phan-quyen-can-bo',
      component: () => import('@/views/canbo/PhanQuyenCanBo.vue'),
      meta: {
        requiresAuth: true,
        permission: 'QUAN_LY_CAN_BO',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const canBo = JSON.parse(localStorage.getItem('canBoLogin') || 'null')
  const userPermissions = canBo?.quyen || []

  // Chưa đăng nhập mà vào route cần auth
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  // Đã đăng nhập mà vào login
  if (to.meta.guestOnly && token) {
    next('/')
    return
  }

  // Trường hợp route cần đúng 1 quyền
  if (to.meta.permission) {
    if (!userPermissions.includes(to.meta.permission)) {
      next('/403')
      return
    }
  }

  // Trường hợp route chỉ cần 1 trong nhiều quyền
  if (to.meta.permissions) {
    const hasAnyPermission = to.meta.permissions.some((permission) =>
      userPermissions.includes(permission),
    )

    if (!hasAnyPermission) {
      next('/403')
      return
    }
  }

  next()
})

export default router
