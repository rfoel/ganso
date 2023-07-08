export default interface Http {
  on(
    method: 'get' | 'post',
    url: string,
    callback: (
      params: any,
      body: any,
    ) => Promise<{ status: number; body: any }>,
  ): void

  listen(port: number): void
}
