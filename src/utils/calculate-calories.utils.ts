const CYCLING_MET_TABLE = [
  { minSpeed: 0, maxSpeed: 10, MET: 4.8 },
  { minSpeed: 10, maxSpeed: 16, MET: 8 },
  { minSpeed: 16, maxSpeed: 20, MET: 12 },
  { minSpeed: 20, maxSpeed: 25, MET: 14 },
  { minSpeed: 25, maxSpeed: Infinity, MET: 16 },
]

function calculateBmr(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  isMale: boolean,
): number {
  if (isMale) {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161
}

function getMETFromSpeed(averageSpeed: number): number {
  const metEntry = CYCLING_MET_TABLE.find(
    ({ minSpeed, maxSpeed }) => averageSpeed >= minSpeed && averageSpeed < maxSpeed,
  )

  return metEntry?.MET ?? 4.8
}

export function calculateCalories({
  weightKg,
  averageSpeed,
  durationHours,
  heightCm,
  ageYears,
  elevationGainMeters = 0,
  elevationLossMeters = 0,
  isMale = true,
}: {
  weightKg: number
  averageSpeed: number
  durationHours: number
  heightCm: number
  ageYears: number
  elevationGainMeters?: number
  elevationLossMeters?: number
  isMale?: boolean
}): number {
  const met = getMETFromSpeed(averageSpeed)

  const bmr = calculateBmr(weightKg, heightCm, ageYears, isMale)
  const aerobicCalories = (met * bmr) / 1.2 * durationHours

  const elevationCalories = (weightKg * elevationGainMeters) / 100 * 0.63

  return Math.round(aerobicCalories + elevationCalories)
}
