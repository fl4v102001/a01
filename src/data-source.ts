import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Carrega as variáveis de ambiente do .env

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    schema: 'sandbox',
    synchronize: false, // Usaremos migrations
    logging: true,
    entities: [__dirname + '/entities/*.{js,ts}'],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    subscribers: [],
});
