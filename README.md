# QLGPLX_All_Rank_FE

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

```
QLGPLX_All_Rank_FE
├─ .editorconfig
├─ .oxlintrc.json
├─ .prettierrc.json
├─ eslint.config.js
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ App.vue
│  ├─ assets
│  │  ├─ css
│  │  │  ├─ app.css
│  │  │  ├─ congdan
│  │  │  │  ├─ ds_congdan.css
│  │  │  │  └─ them_cong_dan.css
│  │  │  ├─ hoso
│  │  │  │  ├─ ds-ho-so.css
│  │  │  │  └─ them-ho-so.css
│  │  │  ├─ ketqua
│  │  │  │  └─ ketqua.css
│  │  │  └─ kythi
│  │  │     ├─ kythi-css.css
│  │  │     ├─ them-ho-so-vao-ky-thi.css
│  │  │     └─ them-ky-thi.css
│  │  ├─ data
│  │  │  └─ tinh_tp.json
│  │  ├─ icon
│  │  │  └─ gif
│  │  │     └─ loading.gif
│  │  ├─ image
│  │  └─ logo.svg
│  ├─ components
│  │  ├─ common
│  │  │  ├─ ConfirmDialog.vue
│  │  │  ├─ ConfirmModal.vue
│  │  │  ├─ Loading.vue
│  │  │  └─ ToastContainer.vue
│  │  ├─ HelloWorld.vue
│  │  ├─ icons
│  │  │  ├─ IconCommunity.vue
│  │  │  ├─ IconDocumentation.vue
│  │  │  ├─ IconEcosystem.vue
│  │  │  ├─ IconSupport.vue
│  │  │  └─ IconTooling.vue
│  │  ├─ layout
│  │  │  ├─ Footer.vue
│  │  │  ├─ Header.vue
│  │  │  ├─ MainLayout.vue
│  │  │  └─ NavMenu.vue
│  │  ├─ TheWelcome.vue
│  │  └─ WelcomeItem.vue
│  ├─ main.js
│  ├─ models
│  ├─ router
│  │  └─ index.js
│  ├─ services
│  │  ├─ api.js
│  │  └─ congdanService.js
│  ├─ stores
│  │  ├─ counter.js
│  │  ├─ loadingStore.js
│  │  ├─ sidebarStore.js
│  │  ├─ themeStore.js
│  │  └─ toastStore.js
│  ├─ utils
│  │  └─ helper.js
│  └─ views
│     ├─ congdan
│     │  ├─ DSCongDan.vue
│     │  ├─ SuaCongDan.vue
│     │  └─ ThemCongDan.vue
│     ├─ HomeView.vue
│     ├─ hoso
│     │  ├─ DSHoso.vue
│     │  └─ ThemHoso.vue
│     ├─ ketqua
│     │  └─ KetquaView.vue
│     └─ kythi
│        ├─ DSKythi.vue
│        ├─ ThemHosoKythi.vue
│        └─ ThemKythi.vue
└─ vite.config.js

```