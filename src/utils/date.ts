/**
 * Format date according to requirements:
 * - < 1 min: "just now"
 * - Same day: "HH:mm"
 * - Different day: "d Mmm"
 */
export function formatChatTime(date: Date, now: Date = new Date()): string {
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / (1000 * 60))

    if (diffMin < 1) return 'just now'

    const isSameDay = date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()

    if (isSameDay) {
        const hours = date.getHours().toString().padStart(2, '0')
        const mins = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${mins}`
    }

    const day = date.getDate()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]

    return `${day} ${month}`
}
