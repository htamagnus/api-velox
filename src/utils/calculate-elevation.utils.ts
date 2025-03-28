import { z } from 'zod'

const elevationsSchema = z.array(z.number()).min(2)

export function calculateElevationGainAndLoss(rawElevations: unknown): {
  gain: number
  loss: number
} {
  const elevations = elevationsSchema.parse(rawElevations)

  let gain = 0
  let loss = 0

  for (let i = 1; i < elevations.length; i++) {
    const delta = elevations[i]! - elevations[i - 1]!

    if (delta > 0) gain += delta
    else if (delta < 0) loss += Math.abs(delta)
  }

  return {
    gain: Math.round(gain),
    loss: Math.round(loss),
  }
}
