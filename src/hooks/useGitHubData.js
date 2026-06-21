import { useState, useEffect, useCallback } from "react"
import { getUser, getUserRepos, getAllEvents, getUserOpenPRs, searchUserCommits } from "../services/github"
import { save, load, isExpired } from "../services/storage"

export function useGitHubData(username) {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [events, setEvents] = useState([])
  const [openPRs, setOpenPRs] = useState([])
  const [commitDates, setCommitDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!username) return

    setLoading(true)
    setError(null)

    try {
      const cacheKey = `user_${username}`

      if (!isExpired(cacheKey, 15 * 60 * 1000)) {
        const cached = load(cacheKey)
        if (cached) {
          setUser(cached.user)
          setRepos(cached.repos)
          setEvents(cached.events)
          setOpenPRs(cached.openPRs || [])
          setCommitDates(cached.commitDates || [])
          setLoading(false)
          return
        }
      }

      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

      const [userData, reposData, eventsData, prData, commitSearchData] = await Promise.all([
        getUser(username),
        getUserRepos(username),
        getAllEvents(username),
        getUserOpenPRs(username),
        searchUserCommits(username, ninetyDaysAgo).catch(() => null),
      ])

      setUser(userData)
      setRepos(reposData)
      setEvents(eventsData)
      setOpenPRs(prData.items || [])

      const dates = new Set()
      if (commitSearchData?.items) {
        for (const item of commitSearchData.items) {
          if (item.commit?.committer?.date) {
            dates.add(
              new Date(item.commit.committer.date).toISOString().split("T")[0]
            )
          }
        }
      }
      const commitDatesArr = [...dates]
      setCommitDates(commitDatesArr)

      save(cacheKey, {
        user: userData,
        repos: reposData,
        events: eventsData,
        openPRs: prData.items || [],
        commitDates: commitDatesArr,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { user, repos, events, openPRs, commitDates, loading, error, refetch: fetchData }
}
