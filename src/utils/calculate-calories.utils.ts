const MET_TABLE = [
  { minSpeed: 0, maxSpeed: 22, MET: 8 },
  { minSpeed: 22, maxSpeed: 26, MET: 10 },
  { minSpeed: 26, maxSpeed: 30, MET: 12 },
  { minSpeed: 30, maxSpeed: Infinity, MET: 14 },
]

export function calculateCalories({
  weightKg,
  averageSpeed,
  durationHours,
}: {
  weightKg: number
  averageSpeed: number
  durationHours: number
}): number {
  const metEntry = MET_TABLE.find(
    ({ minSpeed, maxSpeed }) => averageSpeed >= minSpeed && averageSpeed < maxSpeed,
  )

  const MET = metEntry?.MET ?? 8

  return Math.round(MET * weightKg * durationHours)
}
