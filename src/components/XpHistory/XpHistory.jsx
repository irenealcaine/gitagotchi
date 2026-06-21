import { useMemo } from "react"
import { getXpHistory } from "../../utils/tamagotchi"
import "./XpHistory.css"

export default function XpHistory({ events, repos }) {
  const history = useMemo(() => getXpHistory(events, 15, repos), [events, repos])

  if (history.length === 0) return null

  return (
    <div className="xp-history">
      <h3 className="xp-history-title">Historial de XP</h3>
      <div className="xp-history-list">
        {history.map((entry) => (
          <div key={entry.id} className="xp-entry">
            <span className="xp-entry-value" data-type={
              entry.type === "PushEvent" ? "commit"
              : entry.type === "PullRequestEvent" ? "pr"
              : "repo"
            }>
              +{entry.xp} XP
            </span>
            <span className="xp-entry-desc">{entry.description}</span>
            <span className="xp-entry-time">{entry.relative}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
