import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApiApp } from './apiApp';
import { config, validateStartupConfig } from './config';

export async function createExpressApp() {
  // Validate critical security secrets before booting
  validateStartupConfig();

  const app = express();
  app.disable('x-powered-by');

  // Mount official API application under /api
  const apiApp = createApiApp();
  app.use('/api', apiApp);

  // Vite middleware for development / Static files for production
  if (!config.isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}
