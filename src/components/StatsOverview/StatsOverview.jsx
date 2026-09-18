import { useMemo } from "react"
import { computeStreak } from "../../utils/tamagotchi"
import "./StatsOverview.css"

export default function StatsOverview({ repos, events, commitDates, openPRsCount }) {
  const streak = useMemo(() => computeStreak(events, commitDates), [events, commitDates])

  const totalStars = useMemo(
    () => repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
    [repos]
  )

  const totalForks = useMemo(
    () => repos.reduce((sum, r) => sum + (r.forks_count || 0), 0),
    [repos]
  )

  const { issuesOpened, issuesClosed, prsMerged } = useMemo(() => {
    let opened = 0
    let closed = 0
    let merged = 0
    for (const e of events) {
      if (e.type === "IssuesEvent") {
        if (e.payload.action === "opened") opened++
        if (e.payload.action === "closed") closed++
      }
      if (
        e.type === "PullRequestEvent" &&
        e.payload.action === "closed" &&
        e.payload.pull_request?.merged
      ) {
        merged++
      }
    }
    return { issuesOpened: opened, issuesClosed: closed, prsMerged: merged }
  }, [events])

  return (
    <div className="stats-overview">
      <div className="stat-group">
        <span className="stat-group-title">Repositorios</span>
        <div className="stat-group-cards">
          <StatCard value={repos.length} label="Repos públicos" />
          <StatCard value={totalStars} label="Estrellas" color="#ffd700" />
          <StatCard value={totalForks} label="Forks" />
        </div>
      </div>

      <div className="stat-group">
        <span className="stat-group-title">Rachas</span>
        <div className="stat-group-cards">
          <StatCard value={streak.current} label="Racha actual" color="#ffc107" />
          <StatCard value={streak.max} label="Racha máxima" color="#4caf50" />
        </div>
      </div>

      <div className="stat-group">
        <span className="stat-group-title">Pull Requests</span>
        <div className="stat-group-cards">
          <StatCard value={openPRsCount} label="Abiertas" />
          <StatCard value={prsMerged} label="Mergeadas" color="#ce93d8" />
        </div>
      </div>

      <div className="stat-group">
        <span className="stat-group-title">Issues</span>
        <div className="stat-group-cards">
          <StatCard value={issuesOpened} label="Abiertos" color="#4caf50" />
          <StatCard value={issuesClosed} label="Cerrados" color="#f44336" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, color }) {
  return (
    <div className="stat-card">
      <span className="stat-value" style={color ? { color } : undefined}>
        {value}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
