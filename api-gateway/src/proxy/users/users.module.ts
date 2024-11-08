import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}