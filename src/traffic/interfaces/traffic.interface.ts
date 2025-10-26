export enum TrafficSeverity {
  NORMAL = 'normal',
  INTENSE = 'intense',
  CONGESTED = 'congested',
}

export interface TrafficSegment {
  startPoint: [number, number]
  endPoint: [number, number]
  severity: TrafficSeverity
  speedKmh: number
  speedLimit: number
  duration: number
}

export interface TrafficData {
  overallSeverity: TrafficSeverity
  segments: TrafficSegment[]
  updatedAt: Date
  delayMinutes: number
}
