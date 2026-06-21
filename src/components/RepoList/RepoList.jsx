import { useMemo } from "react"
import { filterActiveRepos, getCommitCountFromEvents } from "../../utils/tamagotchi"
import "./RepoList.css"

export default function RepoList({ repos, events }) {
  const activeRepos = useMemo(
    () => filterActiveRepos(repos),
    [repos]
  )

  const repoStats = useMemo(() => {
    return activeRepos.map((repo) => ({
      ...repo,
      recentCommits: getCommitCountFromEvents(events, repo.full_name),
    }))
  }, [activeRepos, events])

  if (repoStats.length === 0) {
    return (
      <div className="repo-list">
        <h3 className="repo-list-title">Repositorios activos (últimos 30 días)</h3>
        <p className="repo-list-empty">No hay repositorios con actividad reciente</p>
      </div>
    )
  }

  return (
    <div className="repo-list">
      <h3 className="repo-list-title">
        Repositorios activos ({repoStats.length})
      </h3>
      <div className="repo-list-items">
        {repoStats.slice(0, 10).map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-item"
          >
            <div className="repo-item-header">
              <span className="repo-item-name">{repo.name}</span>
              {repo.language && (
                <span className="repo-item-lang">{repo.language}</span>
              )}
            </div>
            {repo.description && (
              <p className="repo-item-desc">{repo.description}</p>
            )}
            <div className="repo-item-stats">
              <span className="repo-stat">
                ⭐ {repo.stargazers_count}
              </span>
              <span className="repo-stat">
                🍴 {repo.forks_count}
              </span>
              <span className="repo-stat repo-stat-commits">
                {repo.recentCommits} commits (30d)
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
