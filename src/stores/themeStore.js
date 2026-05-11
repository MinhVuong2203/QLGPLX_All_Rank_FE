import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  // auto apply khi app load
  applyTheme()

  watch(isDark, () => {
    applyTheme()
  })

  return {
    isDark,
    toggleTheme,
  }
})
