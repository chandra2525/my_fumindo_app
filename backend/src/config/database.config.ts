import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'chandra2525',
  database: 'my_fumindo',
  autoLoadModels: true,
  synchronize: true,
};
