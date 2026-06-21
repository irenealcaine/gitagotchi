import { useMemo } from "react"
import {
  computeTamagotchiState,
  computeXP,
  computeLevel,
  computeLevelProgress,
  getStateConfig,
} from "../utils/tamagotchi"

export function useTamagotchi(events, commitDates = [], repos = []) {
  return useMemo(() => {
    const state = computeTamagotchiState(events, commitDates)
    const totalXP = computeXP(events, repos)
    const level = computeLevel(totalXP)
    const progress = computeLevelProgress(totalXP)
    const config = getStateConfig(state)

    return {
      state,
      totalXP,
      level,
      progress,
      config,
    }
  }, [events])
}
