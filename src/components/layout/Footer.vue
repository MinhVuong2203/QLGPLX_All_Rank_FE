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
          He thong quan ly giay phep lai xe, ho so, ky thi va ket qua sat hach.
        </p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h4>He thong</h4>

          <router-link to="/">Tong quan</router-link>
          <router-link to="/cong-dan">Cong dan</router-link>
          <router-link to="/ho-so">Ho so</router-link>
        </div>

        <div class="footer-col">
          <h4>Nghiep vu</h4>

          <router-link to="/ky-thi">Ky thi</router-link>
          <router-link to="/ket-qua">Ket qua</router-link>
          <router-link to="/giay-phep">Giay phep</router-link>
        </div>

        <div class="footer-col">
          <h4>Van hanh</h4>

          <router-link to="/can-bo">Can bo</router-link>
          <span>Ho tro nghiep vu GPLX</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>(c) {{ currentYear }} GPLX Manager</span>
      <span class="footer-status">
        <span class="status-dot"></span>
        San sang xu ly ho so
      </span>
    </div>
  </footer>
</template>
