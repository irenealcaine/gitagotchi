import "./ProfileHeader.css"

export default function ProfileHeader({ user }) {
  if (!user) return null

  const createdDate = new Date(user.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
        <span className="profile-date">Creado el {createdDate}</span>
      </div>
    </div>
  )
}
