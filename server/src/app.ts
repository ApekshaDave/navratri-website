import express, { type ErrorRequestHandler, Router } from 'express';
import multer from 'multer';
import { mkdirSync } from 'node:fs';
import { config } from './config.ts';
import { pool } from './db.ts';
import { ValidationError } from './validate.ts';
import { importPendingNeonExport, runMigrations } from './migrations.ts';
import { garbasRouter } from './routes/garbas.ts';
import { commentsRouter } from './routes/comments.ts';

mkdirSync(config.uploadDir, { recursive: true });

const app = express();
app.disable('x-powered-by');
// Behind Apache/Passenger on cPanel; needed so rate limiting sees the real client IP
app.set('trust proxy', 1);
app.use(express.json({ limit: '300kb' }));

const api = Router();

api.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    // Only the error code (e.g. ER_ACCESS_DENIED_ERROR, ECONNREFUSED) - never the message,
    // which can include usernames or hostnames
    const code = (err as { code?: string }).code ?? (err instanceof AggregateError ? 'CONNECTION_FAILED' : 'UNKNOWN');
    console.error('Health check DB error:', err);
    res.status(503).json({ ok: false, db: code });
  }
});

api.use(
  '/uploads',
  express.static(config.uploadDir, {
    immutable: true,
    maxAge: '30d',
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  }),
);
api.use(garbasRouter);
api.use(commentsRouter);

// Passenger may or may not strip the /api prefix depending on setup, so accept both
app.use('/api', api);
app.use('/', api);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Audio file must be under 10MB' : err.message;
    res.status(400).json({ error: message });
  } else if (err?.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request is too large' });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
app.use(errorHandler);

// No shell access on the host, so schema setup and the one-time Neon import run at boot.
// A database failure is logged but doesn't stop the server; /api/health will report it.
async function start() {
  try {
    await runMigrations();
    await importPendingNeonExport();
  } catch (err) {
    console.error('Startup migration failed:', err);
  }

  app.listen(config.port, () => {
    console.log(`NavSwar API listening on port ${config.port}`);
  });
}

start();
