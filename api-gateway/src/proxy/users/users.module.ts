import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { MessagingModule } from '../../messaging/messaging.module';

@Module({
  imports: [MessagingModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}