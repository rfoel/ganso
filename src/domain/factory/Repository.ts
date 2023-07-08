import GameRepository from 'domain/repository/Game'
import MissionRepository from 'domain/repository/Mission'

export default interface RepositoryFactory {
  game: GameRepository
  mission: MissionRepository
}
