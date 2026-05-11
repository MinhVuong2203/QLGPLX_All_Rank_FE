<!-- components/common/ConfirmDialog.vue -->
<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div v-if="isOpen" class="confirm-overlay" @click.self="handleCancel">
        <transition name="confirm-scale">
          <div v-if="isOpen" class="confirm-dialog">
            <div class="confirm-icon">
              <lord-icon
                :src="iconUrl"
                trigger="loop"
                :colors="iconColor"
                style="width: 80px; height: 80px"
              >
              </lord-icon>
            </div>

            <div class="confirm-content">
              <h3 class="confirm-title">{{ title }}</h3>
              <p class="confirm-message">{{ message }}</p>
            </div>

            <div class="confirm-actions">
              <button class="confirm-btn confirm-btn-cancel" @click="handleCancel">
                {{ cancelText }}
              </button>
              <button class="confirm-btn confirm-btn-confirm" @click="handleConfirm">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Xác nhận',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Đồng ý',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, success, info
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)

const iconUrl = computed(() => {
  const icons = {
    warning: 'https://cdn.lordicon.com/hrqwmuhr.json',
    danger: 'https://cdn.lordicon.com/tdrtiskw.json',
    success: 'https://cdn.lordicon.com/oqdmuxru.json',
    info: 'https://cdn.lordicon.com/nocovwne.json',
  }
  return icons[props.type] || icons.warning
})

const iconColor = computed(() => {
  const colors = {
    warning: 'primary:#f59e0b',
    danger: 'primary:#ef4444',
    success: 'primary:#10b981',
    info: 'primary:#2564eb',
  }
  return colors[props.type] || colors.warning
})

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

defineExpose({
  open,
  close,
})
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.confirm-dialog {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  border: 2px solid var(--border);
}

.confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.confirm-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.confirm-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-display);
  margin: 0;
}

.confirm-message {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.confirm-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: var(--font-body);
}

.confirm-btn-cancel {
  background: var(--bg-surface-2);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.confirm-btn-cancel:hover {
  background: var(--bg-surface);
  border-color: var(--text-secondary);
  transform: translateY(-2px);
}

.confirm-btn-confirm {
  background: var(--accent);
  color: white;
}

.confirm-btn-confirm:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--accent-glow);
}

/* Transitions */
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.3s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

.confirm-scale-enter-active,
.confirm-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.confirm-scale-enter-from,
.confirm-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* Responsive */
@media (max-width: 480px) {
  .confirm-dialog {
    padding: 1.5rem;
    max-width: 90%;
  }

  .confirm-title {
    font-size: 1.25rem;
  }

  .confirm-message {
    font-size: 1rem;
  }

  .confirm-actions {
    flex-direction: column-reverse;
  }

  .confirm-btn {
    width: 100%;
  }
}
</style>