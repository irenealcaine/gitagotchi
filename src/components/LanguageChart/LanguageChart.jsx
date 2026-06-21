import { useMemo } from "react"
import { aggregateLanguages } from "../../utils/tamagotchi"
import "./LanguageChart.css"

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Lua: "#000080",
  Scala: "#c22d40",
  Elixir: "#4e2a8e",
  "Jupyter Notebook": "#DA5B0B",
}

const FALLBACK_COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6b9d",
  "#c44dff", "#ff8c42", "#3dd8ff", "#ff4d6d", "#95e62d",
]

function getLanguageColor(lang) {
  if (LANG_COLORS[lang]) return LANG_COLORS[lang]
  let hash = 0
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash)
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length]
}

export default function LanguageChart({ repos }) {
  const languages = useMemo(() => aggregateLanguages(repos), [repos])

  if (languages.length === 0) {
    return (
      <div className="language-chart">
        <h3 className="language-chart-title">Lenguajes más usados</h3>
        <p className="language-chart-empty">Sin datos de lenguajes</p>
      </div>
    )
  }

  return (
    <div className="language-chart">
      <h3 className="language-chart-title">Lenguajes más usados</h3>
      <div className="language-bars">
        {languages.slice(0, 8).map((lang) => (
          <div key={lang.name} className="language-bar-row">
            <span className="language-bar-name">{lang.name}</span>
            <div className="language-bar-track">
              <div
                className="language-bar-fill"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: getLanguageColor(lang.name),
                }}
              />
            </div>
            <span className="language-bar-pct">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
