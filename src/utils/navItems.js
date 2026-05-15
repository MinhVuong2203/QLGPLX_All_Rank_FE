export const menuItems = [
  {
    path: '/',
    label: 'TỔNG QUAN',
    icon: 'https://cdn.lordicon.com/zldpstex.json',
    permission: null,
    state: null,
  },
  {
    path: '/cong-dan',
    label: 'CÔNG DÂN',
    icon: 'https://cdn.lordicon.com/rzsnbiaw.json',
    permissions: ['QUAN_LY_HO_SO', 'DUYET_HO_SO'],
    state: 'morph-group',
  },
  {
    path: '/ho-so',
    label: 'HỒ SƠ',
    icon: 'https://cdn.lordicon.com/iubtdgvu.json',
    permissions: ['QUAN_LY_HO_SO', 'DUYET_HO_SO'],
    state: null,
  },
  {
    path: '/ky-thi',
    label: 'KỲ THI',
    icon: 'https://cdn.lordicon.com/noncoqhc.json',
    permission: 'QUAN_LY_KY_THI',
    state: null,
  },
  {
    path: '/ket-qua',
    label: 'KẾT QUẢ',
    icon: 'https://cdn.lordicon.com/aapkxxza.json',
    permission: 'NHAP_KET_QUA_THI',
    state: null,
  },
  {
    path: '/giay-phep',
    label: 'GIẤY PHÉP',
    icon: 'https://cdn.lordicon.com/xvfgwmmv.json',
    permission: 'CAP_GPLX',
    state: null,
  },
  {
    path: '/can-bo',
    label: 'CÁN BỘ',
    icon: 'https://cdn.lordicon.com/xvfgwmmv.json',
    permission: 'QUAN_LY_CAN_BO',
    state: null,
  },
]

export const isMenuItemActive = (item, currentPath) => {
  if (item.path === '/') return currentPath === '/'

  return currentPath === item.path || currentPath.startsWith(`${item.path}/`)
}

export const getActiveMenuItem = (currentPath) =>
  menuItems.find((item) => isMenuItemActive(item, currentPath)) || menuItems[0]
