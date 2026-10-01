import 'dotenv/config';
import path from 'node:path';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  isProduction: process.env.NODE_ENV === 'production',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
  },
  // Keep uploads outside the deploy folder so deployments never wipe them
  uploadDir: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
  maxAudioBytes: 10 * 1024 * 1024,
};
