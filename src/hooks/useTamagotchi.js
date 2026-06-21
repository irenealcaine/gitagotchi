import { useMemo } from "react"
import {
  computeTamagotchiState,
  computeXP,
  computeLevel,
  computeLevelProgress,
  getStateConfig,
} from "../utils/tamagotchi"

export function useTamagotchi(events) {
  return useMemo(() => {
    const state = computeTamagotchiState(events)
    const totalXP = computeXP(events)
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
