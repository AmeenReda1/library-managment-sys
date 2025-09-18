import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppConfig } from 'src/config/config.schema';
console.log(join(__dirname, '../../**/*.entity.{js,ts}'));
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: AppConfig.DATABASE_HOST,
            port: AppConfig.DATABASE_PORT,
            username: AppConfig.DATABASE_USER,
            password: AppConfig.DATABASE_PASSWORD,
            database: AppConfig.DATABASE_NAME,
            entities: [join(__dirname, '../../**/*.entity.{js,ts}')],
            synchronize: true, // TODO: change to false in production
        }),
    ],
})
export class DatabaseModule { }
