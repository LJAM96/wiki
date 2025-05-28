import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB } from '@docmost/db/types/kysely.types';
import { Migrator, FileMigrationProvider } from 'kysely';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationService.name);

  constructor(@InjectKysely() private readonly db: KyselyDB) {}

  async onApplicationBootstrap() {
    await this.runMigrations();
  }

  private async runMigrations() {
    try {
      this.logger.log('Running database migrations...');

      const migrator = new Migrator({
        db: this.db,
        provider: new FileMigrationProvider({
          fs,
          path,
          migrationFolder: path.join(__dirname, '../../database/migrations'),
        }),
      });

      const { error, results } = await migrator.migrateToLatest();

      results?.forEach((it) => {
        if (it.status === 'Success') {
          this.logger.log(`Migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
          this.logger.error(`Failed to execute migration "${it.migrationName}"`);
        }
      });

      if (error) {
        this.logger.error('Failed to migrate', error);
        throw error;
      }

      this.logger.log('Database migrations completed successfully');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }
}
