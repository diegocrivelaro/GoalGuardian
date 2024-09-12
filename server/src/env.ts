import z from 'zod';

const envSchema = z.object({
  DB_URL: z.string(),
  SERVER_PORT: z.string(),
});

export const env = envSchema.parse(process.env);
