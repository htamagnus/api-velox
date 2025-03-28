import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { AthleteEntity } from './athlete.entity'

@Entity('saved_routes')
export class SavedRouteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => AthleteEntity, athlete => athlete.savedRoutes)
  @JoinColumn({ name: 'athlete_id' })
  athlete!: AthleteEntity

  @Column({ name: 'athlete_id' })
  athleteId!: string

  @Column('varchar')
  origin!: string

  @Column('varchar')
  destination!: string

  @Column('varchar')
  modality!: 'road' | 'mtb'

  @Column('float')
  distanceKm!: number

  @Column('int')
  estimatedTimeMinutes!: number

  @Column('int')
  estimatedCalories!: number

  @Column('int')
  elevationGain?: number

  @Column('int')
  elevationLoss?: number

  @Column('text')
  polyline!: string

  @CreateDateColumn()
  createdAt!: Date
}
