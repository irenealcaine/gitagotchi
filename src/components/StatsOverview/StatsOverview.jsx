import "./StatsOverview.css"

export default function StatsOverview({ totalRepos, openPRsCount }) {
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
    </div>
  )
}
