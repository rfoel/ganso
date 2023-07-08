declare namespace NodeJS {
  export interface ProcessEnv {
    DB_STRATEGY: string
    DYNAMO_DB_URL: string
    POSTGRES_DB_URL: string
    PORT: string
  }
}
