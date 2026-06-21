const PREFIX = "gitagotchi_"

export function save(key, data) {
  try {
    const item = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(PREFIX + key, JSON.stringify(item))
  } catch (e) {
    console.warn("Failed to save to localStorage:", e)
  }
}

export function load(key) {
  try {
    const item = localStorage.getItem(PREFIX + key)
    if (!item) return null
    const { data } = JSON.parse(item)
    return data
  } catch (e) {
    return null
  }
}

export function loadMeta(key) {
  try {
    const item = localStorage.getItem(PREFIX + key)
    if (!item) return null
    return JSON.parse(item)
  } catch (e) {
    return null
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

export function isExpired(key, maxAge = 5 * 60 * 1000) {
  const meta = loadMeta(key)
  if (!meta) return true
  return Date.now() - meta.timestamp > maxAge
}
