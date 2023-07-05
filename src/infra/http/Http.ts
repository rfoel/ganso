export default interface Http {
  on(
    method: 'get' | 'post',
    url: string,
    callback: (
      params: Record<string, string>,
      body: Record<string, any>,
    ) => Promise<{ status: number; body: any }>,
  ): void

  listen(port: number): void
}
