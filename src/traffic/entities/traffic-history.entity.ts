import { AthleteEntity } from '@commons/entities'
import { TrafficData, TrafficSeverity } from '@traffic/interfaces'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('traffic_histories')
export class TrafficHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => AthleteEntity)
  @JoinColumn({ name: 'athlete_id' })
  athlete!: AthleteEntity

  @Column({ name: 'athlete_id' })
  athleteId!: string

  @Column('uuid')
  plannedRouteId!: string

  @Column('enum', { enum: TrafficSeverity })
  predictedSeverity!: TrafficSeverity

  @Column('jsonb')
  trafficData!: TrafficData

  @Column('timestamp')
  predictedAt!: Date

  @Column('enum', { enum: TrafficSeverity, nullable: true })
  actualSeverity!: TrafficSeverity | null

  @CreateDateColumn()
  createdAt!: Date
}
