import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';

@Module({
  controllers: [PerfilController],
  providers: [PerfilService]
})
export class PerfilModule {}
