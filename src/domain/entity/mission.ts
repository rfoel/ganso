import Game from './game'

export const categories = ['text', 'photo+video', 'gps'] as const

export type Category = (typeof categories)[number]

export default class Mission {
  id?: number

  constructor(
    readonly name: string,
    readonly description: string,
    readonly points: number,
    readonly category: Category,
    readonly game: Game,
    id?: number,
  ) {
    if (id) this.id = id
  }
}
