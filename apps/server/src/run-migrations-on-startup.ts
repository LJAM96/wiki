import { execSync } from 'child_process';

export function runMigrationsOnStartup() {
  try {
    // Run migrations using ts-node and kysely-migration-cli
    execSync('pnpm exec ts-node apps/server/src/database/migrate.ts', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    // You may adjust the command above if your migration entrypoint is different
    // or if you want to use a compiled JS file in production.
  } catch (err) {
    console.error('Failed to run database migrations on startup:', err);
    process.exit(1);
  }
}
