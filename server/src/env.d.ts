declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_HOST: string;
      REDIS_URL: string;
      PORT: string;
      SESSION_SECRET: string;
      ORIGIN: string;
    }
  }
}

export {}
