import { useMemo } from "react"
import { getActivityLog } from "../../utils/tamagotchi"
import "./ActivityLog.css"

const TYPE_LABELS = {
  PushEvent: "Push",
  PullRequestEvent: "PR",
  CreateEvent: "Crear",
  ForkEvent: "Fork",
  WatchEvent: "Star",
  IssuesEvent: "Issue",
  IssueCommentEvent: "Comment",
}

function formatDayHeader(date) {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const dateStr = date.toISOString().split("T")[0]

  if (dateStr === todayStr) return "Hoy"
  if (dateStr === yesterday) return "Ayer"
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ActivityLog({ events }) {
  const groupedDays = useMemo(() => {
    const log = getActivityLog(events)
    if (log.length === 0) return []

    const groups = {}
    for (const entry of log) {
      const day = entry.timestamp.toISOString().split("T")[0]
      if (!groups[day]) groups[day] = []
      groups[day].push(entry)
    }

    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([day, entries]) => ({
        day,
        label: formatDayHeader(new Date(day + "T12:00:00")),
        entries,
      }))
  }, [events])

  if (groupedDays.length === 0) return null

  return (
    <div className="activity-log">
      <h3 className="activity-log-title">Historial de actividad</h3>
      {groupedDays.map((group) => (
        <div key={group.day} className="activity-day-group">
          <div className="activity-day-header">{group.label}</div>
          <div className="activity-day-entries">
            {group.entries.map((entry) => (
              <div key={entry.id} className="activity-entry">
                <span className="activity-entry-type">
                  {TYPE_LABELS[entry.type] || entry.type.replace("Event", "")}
                </span>
                <span className="activity-entry-desc">{entry.description}</span>
                <span className="activity-entry-time">{entry.relative}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
