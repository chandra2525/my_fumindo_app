import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  timezone: '+07:00',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'chandra2525',
  database: 'my_fumindo',
  autoLoadModels: true,
  synchronize: true,
};
