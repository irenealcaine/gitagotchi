import ProfileHeader from "../ProfileHeader/ProfileHeader"
import StatsOverview from "../StatsOverview/StatsOverview"
import LanguageChart from "../LanguageChart/LanguageChart"
import RepoList from "../RepoList/RepoList"
import ActivityLog from "../ActivityLog/ActivityLog"
import "./Dashboard.css"

export default function Dashboard({ user, repos, events, openPRs, commitDates }) {
  if (!user) return null

  return (
    <div className="dashboard">
      <ProfileHeader user={user} repos={repos} />

      <div className="dashboard-grid">
        <StatsOverview
          repos={repos}
          events={events}
          commitDates={commitDates}
          openPRsCount={openPRs.length}
        />

        <LanguageChart repos={repos} />
      </div>

      <RepoList repos={repos} events={events} />

      <ActivityLog events={events} />
    </div>
  )
}
