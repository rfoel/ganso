import Game from 'domain/entity/Game'

export default interface GameRepository {
  get(id: number): Promise<Game>

  list(): Promise<Game[]>

  create(game: Game): Promise<Required<Game>>

  update(game: Required<Game>): Promise<Game>
}