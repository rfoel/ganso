export default class SchemaError extends Error {
  status: number

  constructor(readonly message: string) {
    super()
    this.status = 422
  }
}
