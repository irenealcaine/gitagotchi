const XP_PER_LEVEL = 300
const XP_COMMIT = 10
const XP_PR = 50
const XP_REPO = 100

export function computeTamagotchiState(events, commitDates = []) {
  if (!events || events.length === 0) return "sad"

  const pushEvents = events.filter((e) => e.type === "PushEvent")
  if (pushEvents.length === 0 && commitDates.length === 0) return "sad"

  const now = new Date()

  const latestEventDate = pushEvents.length > 0
    ? new Date(pushEvents[0].created_at)
    : null

  const latestCommitDate = commitDates.length > 0
    ? new Date(Math.max(...commitDates.map((d) => new Date(d))))
    : null

  const latestActivity = latestEventDate && latestCommitDate
    ? new Date(Math.max(latestEventDate, latestCommitDate))
    : latestEventDate || latestCommitDate

  const hoursDiff = (now - latestActivity) / (1000 * 60 * 60)

  if (hoursDiff <= 24) {
    const recentCount = pushEvents
      .filter((e) => {
        const date = new Date(e.created_at)
        return (now - date) / (1000 * 60 * 60) <= 24
      })
      .reduce((sum, e) => sum + (e.payload.size || 1), 0)

    const todayStr = now.toISOString().split("T")[0]
    const recentCommits = commitDates.filter((d) => d === todayStr).length

    if (recentCount + recentCommits > 3) return "happy"
    return "ok"
  }

  if (hoursDiff <= 48) return "hungry"
  if (hoursDiff <= 72) return "starving"
  return "dead"
}

export function computeXP(events, repos = []) {
  let xp = 0
  const seenRepos = new Set()

  for (const event of events) {
    switch (event.type) {
      case "PushEvent":
        xp += XP_COMMIT * (event.payload.size || 1)
        break
      case "PullRequestEvent":
        xp += XP_PR
        break
      case "CreateEvent":
        if (event.payload.ref_type === "repository") {
          xp += XP_REPO
          seenRepos.add(event.repo.name)
        }
        break
    }
  }

  const now = new Date()
  for (const repo of repos) {
    const repoName = repo.full_name || repo.name
    if (seenRepos.has(repoName)) continue

    const created = new Date(repo.created_at)
    const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24)
    if (daysSinceCreation > 7) continue

    xp += XP_REPO
  }

  return xp
}

export function computeLevel(totalXP) {
  return Math.floor(totalXP / XP_PER_LEVEL)
}

export function computeLevelProgress(totalXP) {
  return totalXP % XP_PER_LEVEL
}

export function computeStreak(events, extraDays = []) {
  const activeDays = new Set()

  if (events) {
    for (const event of events) {
      const date = new Date(event.created_at).toISOString().split("T")[0]
      activeDays.add(date)
    }
  }

  for (const day of extraDays) {
    activeDays.add(day)
  }

  if (activeDays.size === 0) return { current: 0, max: 0 }

  const sortedDays = [...activeDays].sort().reverse()
  if (sortedDays.length === 0) return { current: 0, max: 0 }

  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

  let current = 0
  if (sortedDays[0] === today || sortedDays[0] === yesterday) {
    const checkDate = sortedDays[0]
    let cursor = new Date(checkDate)

    while (sortedDays.includes(cursor.toISOString().split("T")[0])) {
      current++
      cursor.setDate(cursor.getDate() - 1)
    }
  }

  let max = 0
  let streak = 1
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1])
    const curr = new Date(sortedDays[i])
    const diff = (prev - curr) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      streak++
    } else {
      max = Math.max(max, streak)
      streak = 1
    }
  }
  max = Math.max(max, streak)

  return { current, max }
}

import happyImg from "../assets/gitagotchi-happy.png"
import okImg from "../assets/gitagotchi-ok.png"
import hungryImg from "../assets/gitagotchi-hungry.png"
import starvingImg from "../assets/gitagotchi-starving.png"
import deadImg from "../assets/gitagotchi-dead.png"

export function getStateConfig(state) {
  const states = {
    happy: { color: "#ff69b4", label: "Feliz", image: happyImg },
    ok: { color: "#4caf50", label: "OK", image: okImg },
    hungry: { color: "#ffc107", label: "Hambriento", image: hungryImg },
    starving: { color: "#f44336", label: "Famelico", image: starvingImg },
    dead: { color: "#78909c", label: "Muerto", image: deadImg },
  }
  return states[state] || states.dead
}

export function filterActiveRepos(repos) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return repos.filter((repo) => {
    const pushedAt = new Date(repo.pushed_at)
    return pushedAt >= thirtyDaysAgo
  })
}

export function getCommitCountFromEvents(events, repoFullName) {
  return events
    .filter((e) => e.type === "PushEvent" && e.repo.name === repoFullName)
    .reduce((sum, e) => sum + (e.payload.size || 1), 0)
}

export function getEventDateRange(events) {
  if (!events || events.length === 0) return null

  const dates = events.map((e) => new Date(e.created_at))
  const oldest = new Date(Math.min(...dates))
  const newest = new Date(Math.max(...dates))

  return {
    oldest,
    newest,
    label: `${oldest.toLocaleDateString("es-ES")} - ${newest.toLocaleDateString("es-ES")}`,
  }
}

export function formatRelativeTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "ahora"
  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours} h`
  if (diffDays < 7) return `hace ${diffDays} d`
  return date.toLocaleDateString("es-ES")
}

export function getXpHistory(events, limit = 20, repos = []) {
  if (!events) return []

  const entries = []
  const seenRepos = new Set()

  for (const event of events) {
    let xp = 0
    let description = ""

    switch (event.type) {
      case "PushEvent": {
        const commits = event.payload.size || 1
        xp = XP_COMMIT * commits
        description = `Push a ${event.repo.name} (${commits} commit${commits > 1 ? "s" : ""})`
        break
      }
      case "PullRequestEvent":
        xp = XP_PR
        description = `PR ${event.payload.action} en ${event.repo.name}`
        break
      case "CreateEvent":
        if (event.payload.ref_type === "repository") {
          xp = XP_REPO
          description = `Repo creado: ${event.repo.name}`
          seenRepos.add(event.repo.name)
        }
        break
    }

    if (xp > 0) {
      entries.push({
        id: event.id,
        xp,
        description,
        timestamp: new Date(event.created_at),
        type: event.type,
        relative: formatRelativeTime(new Date(event.created_at)),
      })
    }
  }

  const now = new Date()
  for (const repo of repos) {
    const repoName = repo.full_name || repo.name
    if (seenRepos.has(repoName)) continue

    const created = new Date(repo.created_at)
    const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24)
    if (daysSinceCreation > 7) continue

    entries.push({
      id: `repo_${repo.id}`,
      xp: XP_REPO,
      description: `Repo creado: ${repoName}`,
      timestamp: created,
      type: "CreateEvent",
      relative: formatRelativeTime(created),
    })
  }

  entries.sort((a, b) => b.timestamp - a.timestamp)

  return entries.slice(0, limit)
}

export function getActivityLog(events) {
  if (!events) return []

  const entries = []

  for (const event of events) {
    let description = ""

    switch (event.type) {
      case "PushEvent": {
        const commits = event.payload?.size || 1
        description = `Push a ${event.repo.name} (${commits} commit${commits > 1 ? "s" : ""})`
        break
      }
      case "PullRequestEvent":
        description = `PR ${event.payload.action} en ${event.repo.name}`
        if (event.payload.pull_request?.title) {
          description += `: ${event.payload.pull_request.title}`
        }
        break
      case "CreateEvent":
        if (event.payload.ref_type === "repository") {
          description = `Repo creado: ${event.repo.name}`
        } else {
          description = `Creado ${event.payload.ref_type} en ${event.repo.name}`
        }
        break
      case "ForkEvent":
        description = `Fork de ${event.repo.name}`
        break
      case "WatchEvent":
        description = `Star ${event.repo.name}`
        break
      case "IssuesEvent":
        description = `Issue ${event.payload.action} en ${event.repo.name}`
        break
      default:
        description = `${event.type} en ${event.repo.name}`
    }

    entries.push({
      id: event.id,
      type: event.type,
      description,
      timestamp: new Date(event.created_at),
      repo: event.repo.name,
      relative: formatRelativeTime(new Date(event.created_at)),
    })
  }

  return entries
}

export function aggregateLanguages(repos) {
  const langMap = {}

  for (const repo of repos) {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1
    }
  }

  const total = Object.values(langMap).reduce((a, b) => a + b, 0)

  return Object.entries(langMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}
