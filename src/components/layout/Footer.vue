<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="main-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <div class="footer-logo">
          <span class="footer-logo-mark">G</span>
          <span class="footer-brand">GPLX Manager</span>
        </div>

        <p class="footer-tagline">
          Hệ thống quản lý giấy phép lái xe, hồ sơ, kỳ thi và kết quả sát hạch.
        </p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h4>Hệ thống</h4>

          <router-link to="/">Tổng quan</router-link>
          <router-link to="/cong-dan">Công dân</router-link>
          <router-link to="/ho-so">Hồ sơ</router-link>
        </div>

        <div class="footer-col">
          <h4>Nghiệp vụ</h4>

          <router-link to="/ky-thi">Kỳ thi</router-link>
          <router-link to="/ket-qua">Kết quả</router-link>
          <router-link to="/giay-phep">Giấy phép</router-link>
        </div>

        <div class="footer-col">
          <h4>Vận hành</h4>

          <router-link to="/can-bo">Cán bộ</router-link>
          <span>Hỗ trợ nghiệp vụ GPLX</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ currentYear }} GPLX Manager</span>
      <span class="footer-status">
        <span class="status-dot"></span>
        Sẵn sàng xử lý hồ sơ
      </span>
    </div>
  </footer>
</template>
