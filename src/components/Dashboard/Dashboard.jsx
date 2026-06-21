import { useMemo } from "react"
import ProfileHeader from "../ProfileHeader/ProfileHeader"
import StatsOverview from "../StatsOverview/StatsOverview"
import Streak from "../Streak/Streak"
import LanguageChart from "../LanguageChart/LanguageChart"
import RepoList from "../RepoList/RepoList"
import ActivityLog from "../ActivityLog/ActivityLog"
import { getEventDateRange } from "../../utils/tamagotchi"
import "./Dashboard.css"

export default function Dashboard({ user, repos, events, openPRs, commitDates }) {
  if (!user) return null

  const range = useMemo(() => getEventDateRange(events), [events])

  return (
    <div className="dashboard">
      <ProfileHeader user={user} />

      <div className="dashboard-grid">
        <StatsOverview
          totalRepos={user.public_repos}
          openPRsCount={openPRs.length}
        />

        <Streak events={events} commitDates={commitDates} />

        <LanguageChart repos={repos} />
      </div>

      <RepoList repos={repos} events={events} />

      <ActivityLog events={events} />

      {range && (
        <div className="dashboard-footer">
          Datos de actividad basados en eventos disponibles desde el{" "}
          {new Date(range.oldest).toLocaleDateString("es-ES")}
        </div>
      )}
    </div>
  )
}
