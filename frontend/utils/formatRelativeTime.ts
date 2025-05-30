export function formatRelativeTime(dateString: string): string {
     const date = new Date(dateString)
     const now = new Date()
     const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

     if (seconds < 60) return 'quelques secondes plus tôt'
     const minutes = Math.floor(seconds / 60)
     if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
     const hours = Math.floor(minutes / 60)
     if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`
     const days = Math.floor(hours / 24)
     return `il y a ${days} jour${days > 1 ? 's' : ''}`
}
