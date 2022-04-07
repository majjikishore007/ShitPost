import path from 'path';
import { __prod__ } from '../constants';
import { ConnectionOptions } from 'typeorm';

export default {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrationsRun: true,
  dropSchema: false,
  logging: true,
  entities: [
    path.join(__dirname, '..', 'entities', '**', '*.*'),
    path.join(__dirname, '..', 'entities', '*.*'),
  ],
  migrations: [path.join(__dirname, 'migrations', '*.*')],
  cli: {
    entitiesDir: path.join(__dirname, '..', 'entities'),
    migrationsDir: path.join(__dirname, 'migrations'),
  },
} as ConnectionOptions;
