export default interface Http {
  rest(
    method: 'get' | 'post' | 'put',
    url: string,
    callback: (
      params: any,
      body: any,
    ) => Promise<{ status: number; body: any }>,
  ): void

  graphql(schema: any): void

  listen(port: number): void
}
