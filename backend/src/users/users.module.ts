// import { Module } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';

// @Module({
//   providers: [UsersService],
//   controllers: [UsersController],
//   exports: [UsersService], // Pastikan UsersService diekspor
// })
// export class UsersModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';
import { Employee } from '../employee/employee.model';


@Module({
  imports: [SequelizeModule.forFeature([User, Employee])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
