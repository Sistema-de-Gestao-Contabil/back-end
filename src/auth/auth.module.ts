// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { LocalStrategy } from './strategies/local.strategy';
// import { UsersModule } from 'src/users/users.module';
// import { JwtModule } from '@nestjs/jwt'
// import { JwtStrategy } from './strategies/jwt.strategy';
// // import { LoginValidationMiddleware } from './middlewares/login-validation.middleware';


// @Module({
//   imports: [UsersModule, JwtModule.Register({
//     secret: process.env.JWT_SCRET,
//     signOptions: {expiresIn: '30d'},
//   })],
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, JwtStrategy]
// })
// export class AuthModule {}
// // export class AuthModule implements NestModule {
// //     configure(consumer: MiddlewareConsumer) {
// //       consumer.apply(LoginValidationMiddleware).forRoutes('login');
// //     }
// // }