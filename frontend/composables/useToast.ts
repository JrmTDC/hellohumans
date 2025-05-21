import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
     id: number
     message: string
     type: ToastType
     duration: number
}

const toasts = ref<ToastItem[]>([])
let idCounter = 0

export function useToast() {
     function push(message: string, options: { type?: ToastType; duration?: number } = {}) {
          const id = idCounter++
          const type = options.type || 'success'
          const duration = options.duration || 3000

          toasts.value.push({ id, message, type, duration })

          setTimeout(() => {
               toasts.value = toasts.value.filter(t => t.id !== id)
          }, duration)
     }

     return {
          toasts,
          push,
     }
}
