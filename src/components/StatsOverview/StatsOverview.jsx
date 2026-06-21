import { useMemo } from "react"
import { computeStreak } from "../../utils/tamagotchi"
import "./StatsOverview.css"

export default function StatsOverview({ totalRepos, openPRsCount, events, commitDates }) {
  const streak = useMemo(() => computeStreak(events, commitDates), [events, commitDates])

  return (
    <div className="stats-overview">
      <div className="stat-card">
        <span className="stat-value">{totalRepos}</span>
        <span className="stat-label">Repos públicos</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{openPRsCount}</span>
        <span className="stat-label">PRs abiertas</span>
      </div>
      <div className="stat-card stat-card--streak">
        <span className="stat-value stat-value--streak">{streak.current}</span>
        <span className="stat-label">Racha actual</span>
      </div>
      <div className="stat-card stat-card--streak">
        <span className="stat-value stat-value--max">{streak.max}</span>
        <span className="stat-label">Racha máxima</span>
      </div>
    </div>
  )
}
