export default interface Http {
  on(
    method: 'get' | 'post' | 'put',
    url: string,
    callback: (
      params: any,
      body: any,
    ) => Promise<{ status: number; body: any }>,
  ): void

  listen(port: number): void
}
