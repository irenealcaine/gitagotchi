import "./Achievements.css"

const ACHIEVEMENTS = [
  { id: "streak_7", icon: "🔥", label: "Racha", target: 7, current: (s) => s.maxStreak },
  { id: "streak_14", icon: "🔥", label: "Racha", target: 14, current: (s) => s.maxStreak },
  { id: "streak_30", icon: "🔥", label: "Racha", target: 30, current: (s) => s.maxStreak },
  { id: "commits_50", icon: "💻", label: "Commits totales", target: 50, current: (s) => s.totalCommits },
  { id: "commits_100", icon: "💻", label: "Commits totales", target: 100, current: (s) => s.totalCommits },
  { id: "commits_500", icon: "💻", label: "Commits totales", target: 500, current: (s) => s.totalCommits },
  { id: "level_5", icon: "⭐", label: "Nivel", target: 5, current: (s) => s.level },
  { id: "level_10", icon: "⭐", label: "Nivel", target: 10, current: (s) => s.level },
  { id: "level_15", icon: "⭐", label: "Nivel", target: 15, current: (s) => s.level },
  { id: "level_20", icon: "⭐", label: "Nivel", target: 20, current: (s) => s.level },
  { id: "stars_10", icon: "🌟", label: "Estrellas", target: 10, current: (s) => s.totalStars },
  { id: "stars_50", icon: "🌟", label: "Estrellas", target: 50, current: (s) => s.totalStars },
  { id: "stars_100", icon: "🌟", label: "Estrellas", target: 100, current: (s) => s.totalStars },
]

export default function Achievements({ maxStreak, totalCommits, level, totalStars }) {
  const state = { maxStreak, totalCommits, level, totalStars }

  return (
    <div className="achievements">
      <div className="achievements-list">
        {ACHIEVEMENTS.map((a) => {
          const val = a.current(state)
          const pct = Math.min(100, Math.round((val / a.target) * 100))
          const unlocked = val >= a.target
          return (
            <div key={a.id} className={`achievement ${unlocked ? "achievement--unlocked" : ""}`}>
              <span className="achievement-icon">{a.icon}</span>
              <div className="achievement-body">
                <span className="achievement-label">{a.label}</span>
                <div className="achievement-progress">
                  <div className="achievement-progress-bar">
                    <div
                      className="achievement-progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="achievement-progress-text">{val}/{a.target}</span>
                </div>
              </div>
              <span className="achievement-status">{unlocked ? "✓" : "🔒"}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
