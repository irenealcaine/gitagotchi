import "./Tamagotchi.css"

export default function Tamagotchi({ state, level, progress, totalXP, config, eventRange }) {
  return (
    <div className="tamagotchi">
      <div className="tamagotchi-pet-wrapper">
        <div
          className="tamagotchi-pet"
          style={{ backgroundColor: config.color }}
        />
        <div className="tamagotchi-glow" style={{ backgroundColor: config.color }} />
      </div>

      <div className="tamagotchi-status">
        <span className="tamagotchi-state-label" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>

      <div className="tamagotchi-level">
        <span className="tamagotchi-level-number">Nivel {level}</span>
      </div>

      <div className="tamagotchi-xp-bar">
        <div
          className="tamagotchi-xp-fill"
          style={{
            width: `${(progress / 300) * 100}%`,
            backgroundColor: config.color,
          }}
        />
      </div>

      <div className="tamagotchi-xp-text">
        {progress} / 300 XP · {totalXP} XP
      </div>

    </div>
  )
}
