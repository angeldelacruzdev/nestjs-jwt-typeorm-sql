import { AtGuard } from './common/guards/at.guard';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { PayPalModule } from './paypal/paypal.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { TipoProductosModule } from './tipo-productos/tipo-productos.module';
import { PerfilModule } from './perfil/perfil.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  controllers:[AppController],
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductosModule,
    PayPalModule,
    TipoProductosModule,
    PerfilModule,
    VentasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
