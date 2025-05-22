export function useConnectionBanner() {
     const showBanner = ref(false)
     const countdown = ref(5)
     let countdownInterval: NodeJS.Timeout | null = null
     let retryInterval: NodeJS.Timeout | null = null

     function showAndStartCountdown(duration = 5) {
          showBanner.value = true
          countdown.value = duration

          if (countdownInterval) clearInterval(countdownInterval)

          countdownInterval = setInterval(() => {
               countdown.value--
               if (countdown.value <= 0) {
                    hideBanner()
               }
          }, 1000)
     }

     function hideBanner() {
          showBanner.value = false
          if (countdownInterval) clearInterval(countdownInterval)
          if (retryInterval) clearInterval(retryInterval)
     }

     async function checkInternetConnectivity(): Promise<boolean> {
          try {
               const res = await fetch('https://clients3.google.com/generate_204', { method: 'GET', cache: 'no-store' })
               return res.status === 204
          } catch {
               return false
          }
     }

     async function monitorConnection() {
          const isOnline = await checkInternetConnectivity()
          if (!isOnline) {
               showAndStartCountdown(5)

               retryInterval = setInterval(async () => {
                    const connected = await checkInternetConnectivity()
                    if (connected) {
                         hideBanner()
                    }
               }, 2000)
          }
     }

     onMounted(() => {
          window.addEventListener('offline', monitorConnection)
          window.addEventListener('online', monitorConnection)
     })

     onUnmounted(() => {
          window.removeEventListener('offline', monitorConnection)
          window.removeEventListener('online', monitorConnection)
          if (countdownInterval) clearInterval(countdownInterval)
          if (retryInterval) clearInterval(retryInterval)
     })

     return {
          showBanner,
          countdown,
          triggerManualCheck: monitorConnection,
     }
}
