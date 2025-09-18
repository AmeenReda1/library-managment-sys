import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config/config.schema';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { BorrowingProcessModule } from './borrowing-process/borrowing-process.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 5000, // 5 second
        limit: 2, // 3 requests per second
      },

    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BooksModule,
    BorrowingProcessModule
  ],

  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
