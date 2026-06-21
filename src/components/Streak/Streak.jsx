import { useMemo } from "react"
import { computeStreak } from "../../utils/tamagotchi"
import "./Streak.css"

export default function Streak({ events, commitDates }) {
  const streak = useMemo(() => computeStreak(events, commitDates), [events, commitDates])

  return (
    <div className="streak">
      <div className="streak-item">
        <span className="streak-value">{streak.current}</span>
        <span className="streak-label">Racha actual</span>
      </div>
      <div className="streak-divider" />
      <div className="streak-item">
        <span className="streak-value streak-value--max">{streak.max}</span>
        <span className="streak-label">Racha máxima</span>
      </div>
    </div>
  )
}
