import { useState, useMemo } from "react"
import { load, save } from "./services/storage"
import { useGitHubData } from "./hooks/useGitHubData"
import { useTamagotchi } from "./hooks/useTamagotchi"
import { getEventDateRange } from "./utils/tamagotchi"
import UserSearch from "./components/UserSearch/UserSearch"
import Tamagotchi from "./components/Tamagotchi/Tamagotchi"
import XpHistory from "./components/XpHistory/XpHistory"
import Dashboard from "./components/Dashboard/Dashboard"
import "./App.css"

function App() {
  const [username, setUsername] = useState(() => {
    const saved = load("username")
    return saved || ""
  })

  const { user, repos, events, openPRs, commitDates, loading, error, refetch } =
    useGitHubData(username)

  const tamagotchi = useTamagotchi(events)

  const eventRange = useMemo(() => {
    const range = getEventDateRange(events)
    return range ? new Date(range.oldest).toLocaleDateString("es-ES") : null
  }, [events])

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
      <header className="app-header">
        <span className="app-logo">Gitagotchi</span>
        <div className="app-header-right">
          {user && (
            <button className="app-refresh" onClick={refetch} title="Actualizar datos">
              ↻
            </button>
          )}
          <button className="app-logout" onClick={handleLogout}>
            Cambiar usuario
          </button>
        </div>
      </header>

      {loading && (
        <div className="app-loading">
          <div className="app-loading-spinner" />
          <span>Cargando actividad de {username}...</span>
        </div>
      )}

      {error && (
        <div className="app-error">
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
            <XpHistory events={events} />
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
    </div>
  )
}

export default App
