export default class NotFoundError extends Error {
  status: number

  constructor(readonly message: string) {
    super()
    this.status = 404
  }
}
