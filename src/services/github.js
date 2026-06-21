const API_BASE = "https://api.github.com"

async function fetchGitHub(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    if (response.status === 403) {
      const msg = "Límite de tasa de GitHub alcanzado. Espera unos minutos y recarga."
      throw new Error(msg)
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getUser(username) {
  return fetchGitHub(`${API_BASE}/users/${username}`)
}

export async function getUserRepos(username) {
  return fetchGitHub(`${API_BASE}/users/${username}/repos?per_page=100&sort=pushed&type=owner`)
}

export async function getUserEvents(username, page = 1) {
  return fetchGitHub(`${API_BASE}/users/${username}/events?per_page=100&page=${page}`)
}

export async function getAllEvents(username) {
  const events = []
  const existingIds = new Set()

  for (let page = 1; page <= 5; page++) {
    const pageEvents = await getUserEvents(username, page)
    if (pageEvents.length === 0) break

    const newEvents = pageEvents.filter((e) => {
      if (existingIds.has(e.id)) return false
      existingIds.add(e.id)
      return true
    })

    events.push(...newEvents)

    if (newEvents.length < 100) break
  }

  return events
}

export async function getUserOpenPRs(username) {
  const data = await fetchGitHub(
    `${API_BASE}/search/issues?q=author:${username}+type:pr+state:open`
  )
  return data
}

export async function searchUserCommits(username, since) {
  const sinceStr = since instanceof Date ? since.toISOString() : since
  return fetchGitHub(
    `${API_BASE}/search/commits?q=author:${username}+committer-date:>=${sinceStr}&per_page=100&sort=committer-date&order=desc`
  )
}
