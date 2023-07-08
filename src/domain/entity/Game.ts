export default class Game {
  id?: number

  constructor(
    readonly name: string,
    readonly description: string,
    id?: number,
  ) {
    if (id) this.id = id
  }
}
