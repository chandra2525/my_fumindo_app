import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model'; 

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
