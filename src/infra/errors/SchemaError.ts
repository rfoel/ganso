export default class SchemaError extends Error {
  status: number

  constructor(
    readonly code: string,
    readonly field: string,
  ) {
    super()
    this.status = 422
  }
}
