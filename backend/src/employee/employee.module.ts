// src/modules/employee.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { Branch } from '../branch/branch.model';
import { User } from '../users/users.model';
// import { EmployeeController } from '../controllers/employee.controller';
// import { EmployeeService } from '../services/employee.service';
// import { Employee } from '../models/employee.model';
// import { Branch } from '../models/branch.model';

@Module({
  imports: [SequelizeModule.forFeature([Employee, Branch, User])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
