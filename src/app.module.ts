import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from './schedule/task.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3600000,
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule { }
