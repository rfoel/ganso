import Game from 'domain/entity/game'

export default interface GameRepository {
  get(id: number): Promise<Game>

  list(): Promise<Game[]>

  create(game: Game): Promise<Game>
}
