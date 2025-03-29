import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchoolsModule } from './modules/Schools/schools.module';
import { TeachersModule } from './modules/Teachers/teachers.module';
// import { AuthMiddleware } from './middlewares/auth.middleware';
import { LoggerMiddleware } from './middlewares/Logger.middleware';
import { CustomHeaderMiddleware } from './middlewares/custom-header.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SchoolsModule,
    TeachersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
// app.module.ts
configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(LoggerMiddleware).forRoutes('*')
    // .apply(AuthMiddleware).forRoutes('schools')
    .apply(CustomHeaderMiddleware)
      .forRoutes('teachers', 'schools'); 
}
}