import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'braian1491',
  database: 'turn_market_db',
  autoLoadEntities: true,
  synchronize: true,
};