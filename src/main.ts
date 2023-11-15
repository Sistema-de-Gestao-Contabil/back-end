import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //O CORS é um mecanismo que permite que os recursos sejam solicitados de outro domínio
  app.enableCors()

  //Usando validação
  app.useGlobalPipes(new ValidationPipe({
    //Pega somente os campos da requisição que estão definidos no Dto e os que não estão, somente são descartados
    whitelist: true,
    //Semelhante ao whitelist porem ele lança uma excessão se houver algum campo na requisição que não está definido no Dto 
    forbidNonWhitelisted: true

  }))


  await app.listen(8181);
}
bootstrap();
