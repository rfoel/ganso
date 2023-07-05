import Mission from 'domain/entity/mission'

export default interface MissionRepository {
  get(gameId: number, missionId: number): Promise<Mission>

  list(gameId: number): Promise<Mission[]>

  create(mission: Mission): Promise<Mission>
}
