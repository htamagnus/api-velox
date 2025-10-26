import { AthleteEntity } from '@commons/entities'
import { TrafficSeverity } from '@traffic/interfaces'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('traffic_alerts')
export class TrafficAlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => AthleteEntity)
  @JoinColumn({ name: 'athlete_id' })
  athlete!: AthleteEntity

  @Column({ name: 'athlete_id' })
  athleteId!: string

  @Column('uuid')
  routeId!: string

  @Column('enum', { enum: TrafficSeverity })
  severity!: TrafficSeverity

  @Column('text')
  message!: string

  @Column('boolean', { default: false })
  isResolved!: boolean

  @CreateDateColumn()
  createdAt!: Date
}
