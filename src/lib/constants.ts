export const SAMPLE_SHOWS = [
  "Hamilton",
  "Hadestown",
  "The Lion King",
  "Wicked",
  "Chicago",
  "Sweeney Todd",
]

export function getNextRunLabel(): string {
  const now = new Date()
  const next = new Date()
  next.setUTCHours(14, 0, 0, 0)
  if (now >= next) next.setUTCDate(next.getUTCDate() + 1)
  const diffMs = next.getTime() - now.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (diffH > 0) return `${diffH}h ${diffM}m`
  return `${diffM}m`
}
