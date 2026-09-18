import { useState, useMemo } from "react"
import { load, save } from "./services/storage"
import { useGitHubData } from "./hooks/useGitHubData"
import { useTamagotchi } from "./hooks/useTamagotchi"
import { computeStreak, getEventDateRange } from "./utils/tamagotchi"
import UserSearch from "./components/UserSearch/UserSearch"
import Tamagotchi from "./components/Tamagotchi/Tamagotchi"
import XpHistory from "./components/XpHistory/XpHistory"
import Achievements from "./components/Achievements/Achievements"
import Dashboard from "./components/Dashboard/Dashboard"
import "./App.css"

function App() {
  const [username, setUsername] = useState(() => {
    const saved = load("username")
    return saved || ""
  })

  const { user, repos, events, openPRs, commitDates, loading, error, refetch } =
    useGitHubData(username)

  const tamagotchi = useTamagotchi(events, commitDates, repos)

  const [sidebarTab, setSidebarTab] = useState("xp")

  const eventRange = useMemo(() => {
    const range = getEventDateRange(events)
    return range ? new Date(range.oldest).toLocaleDateString("es-ES") : null
  }, [events])

  const maxStreak = useMemo(
    () => computeStreak(events, commitDates).max,
    [events, commitDates],
  )

  const totalCommits = useMemo(
    () => events
      .filter((e) => e.type === "PushEvent")
      .reduce((sum, e) => sum + (e.payload.size || 1), 0),
    [events],
  )

  const totalStars = useMemo(
    () => repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
    [repos],
  )

  function handleSearch(newUsername) {
    setUsername(newUsername)
    save("username", newUsername)
  }

  function handleLogout() {
    setUsername("")
  }

  if (!username) {
    return <UserSearch onSearch={handleSearch} loading={loading} />
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <header className="app-header">
        <span className="app-logo">Gitagotchi</span>
        <div className="app-header-right">
          {user && (
            <button
              className="app-refresh"
              onClick={refetch}
              title="Actualizar datos"
              aria-label="Actualizar datos"
            >
              ↻
            </button>
          )}
          <button className="app-logout" onClick={handleLogout}>
            Cambiar usuario
          </button>
        </div>
      </header>

      <main id="main-content">
        {loading && (
          <div className="app-loading" role="status">
            <div className="app-loading-spinner" aria-hidden="true" />
            <span>Cargando actividad de {username}...</span>
          </div>
        )}

        {error && (
          <div className="app-error" role="alert">
            <p>{error}</p>
            <div className="app-error-buttons">
              <button onClick={refetch}>Reintentar</button>
              <button onClick={handleLogout}>Cambiar usuario</button>
            </div>
          </div>
        )}

        {!loading && !error && user && (
          <div className="app-content">
            <div className="app-sidebar">
              <Tamagotchi {...tamagotchi} eventRange={eventRange} />
              <div className="sidebar-tabs" role="tablist" aria-label="Panel lateral">
                <button
                  id="tab-xp"
                  role="tab"
                  aria-selected={sidebarTab === "xp"}
                  aria-controls="panel-xp"
                  className={`sidebar-tab ${sidebarTab === "xp" ? "sidebar-tab--active" : ""}`}
                  onClick={() => setSidebarTab("xp")}
                >
                  Historial XP
                </button>
                <button
                  id="tab-achievements"
                  role="tab"
                  aria-selected={sidebarTab === "achievements"}
                  aria-controls="panel-achievements"
                  className={`sidebar-tab ${sidebarTab === "achievements" ? "sidebar-tab--active" : ""}`}
                  onClick={() => setSidebarTab("achievements")}
                >
                  Logros
                </button>
              </div>
              <div
                id="panel-xp"
                role="tabpanel"
                aria-labelledby="tab-xp"
                hidden={sidebarTab !== "xp"}
              >
                <XpHistory events={events} repos={repos} />
              </div>
              <div
                id="panel-achievements"
                role="tabpanel"
                aria-labelledby="tab-achievements"
                hidden={sidebarTab !== "achievements"}
              >
                <Achievements
                  maxStreak={maxStreak}
                  totalCommits={totalCommits}
                  level={tamagotchi.level}
                  totalStars={totalStars}
                />
              </div>
            </div>
            <div className="app-main">
              <Dashboard
                user={user}
                repos={repos}
                events={events}
                openPRs={openPRs}
                commitDates={commitDates}
              />
            </div>
          </div>
        )}
      </main>

      {eventRange && (
        <footer className="app-footer">
          Datos de actividad basados en eventos disponibles desde el {eventRange}
        </footer>
      )}
    </div>
  )
}

export default App
