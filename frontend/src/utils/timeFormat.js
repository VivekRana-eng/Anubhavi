/**
 * Formats notification timestamps into clear, appropriate times:
 * - Real-time/recent: "Just Now • 08:24 PM" or "2 mins ago • 08:22 PM"
 * - Older items: "25 mins ago • 07:59 PM" or formatted date/time
 */
export function formatNotificationTime(item) {
  if (!item) return 'Just Now';

  // If item already has a descriptive mock time with both relative and exact time
  if (typeof item.time === 'string' && (item.time.includes('•') || item.time.includes('ago'))) {
    return item.time;
  }

  // Parse createdAt or timestamp if available
  const rawDate = item.createdAt || item.created_at || item.timestamp;
  if (rawDate) {
    try {
      const createdDate = new Date(rawDate);
      if (!isNaN(createdDate.getTime())) {
        const now = new Date();
        const diffMs = Math.max(0, now.getTime() - createdDate.getTime());
        const diffMins = Math.floor(diffMs / 60000);
        const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

        if (diffMins < 1) {
          return `Just Now • ${timeStr}`;
        } else if (diffMins < 60) {
          return `${diffMins} min${diffMins > 1 ? 's' : ''} ago • ${timeStr}`;
        } else if (diffMins < 1440) {
          const diffHours = Math.floor(diffMins / 60);
          return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago • ${timeStr}`;
        } else {
          return `${createdDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
        }
      }
    } catch (e) {}
  }

  // Fallback
  return item.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getCurrentTimeString() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}
