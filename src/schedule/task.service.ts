import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    //   constructor(private readonly exampleService: ExampleService) {}

    // @Cron('45 * * * * *')
    // handleCron() {
    //     this.logger.debug('该方法将在45秒标记处每分钟运行一次');
    // }

    // @Cron(CronExpression.EVERY_SECOND)
    // handleCron2() {
    //     this.logger.debug('CronExpression.EVERY_SECOND');
    // }

    // // @Interval(10000)
    // // handleInterval() {
    // //     this.logger.debug('2');
    // // }

    // @Timeout(5000)
    // handleTimeout() {
    //     this.logger.debug('Timeout 5000');
    // }

    // @Interval(10000)
    // sendEmail() {
    //     this.logger.debug('3');
    // }
}
