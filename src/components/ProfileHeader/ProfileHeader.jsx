import { useMemo } from "react"
import "./ProfileHeader.css"

export default function ProfileHeader({ user, repos }) {
  if (!user) return null

  const createdDate = new Date(user.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const topLanguage = useMemo(() => {
    const counts = {}
    for (const repo of repos || []) {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1
      }
    }
    const entries = Object.entries(counts)
    if (entries.length === 0) return null
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }, [repos])

  return (
    <div className="profile-header">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="profile-avatar"
      />
      <div className="profile-info">
        <h2 className="profile-name">{user.name || user.login}</h2>
        <span className="profile-username">@{user.login}</span>
        <div className="profile-meta">
          <span className="profile-stat">{user.followers} seguidores</span>
          <span className="profile-stat">{user.following} siguiendo</span>
          {topLanguage && <span className="profile-stat">{topLanguage}</span>}
        </div>
        <span className="profile-date">Creado el {createdDate}</span>
      </div>
    </div>
  )
}
