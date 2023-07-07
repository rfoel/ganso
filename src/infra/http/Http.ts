export default interface Http {
  on(
    method: 'get' | 'post',
    url: string,
    callback: (
      params: unknown,
      body: unknown,
    ) => Promise<{ status: number; body: any }>,
  ): void

  listen(port: number): void
}
