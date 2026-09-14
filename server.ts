import { createExpressApp } from './server/app';

const PORT = 3000;

async function startServer() {
  try {
    const app = await createExpressApp();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[BSEDRC Server] Official Fullstack Server listening on http://0.0.0.0:${PORT}`);
      console.log(`[BSEDRC Server] API endpoints mounted at http://0.0.0.0:${PORT}/api`);
    });
  } catch (error) {
    console.error('[BSEDRC Server] Critical failure starting server:', error);
    process.exit(1);
  }
}

startServer();
