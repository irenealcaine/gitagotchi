import "./Tamagotchi.css"

export default function Tamagotchi({ state, level, progress, totalXP, config, eventRange }) {
  return (
    <div className="tamagotchi">
      <div className="tamagotchi-pet-wrapper">
        <img
          className={`tamagotchi-pet tamagotchi-pet--${state}`}
          src={config.image}
          alt={config.label}
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

      <div
        className="tamagotchi-xp-bar"
        role="progressbar"
        aria-label={`Progreso hacia el nivel ${level + 1}`}
        aria-valuemin={0}
        aria-valuemax={300}
        aria-valuenow={progress}
      >
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
