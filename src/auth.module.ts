import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/auth', // auth yolunu ekleyin
      realm: 'IFM',
      clientId: 'ifm_facility_client',
      secret: 'IYiu8TvaIa9K8abahthSb1OVKx1bWXY6',
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // İlk sırada AuthGuard kullanarak doğrulamayı sağlar
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    Reflector,
  ],
  exports: [KeycloakConnectModule],
})
export class AuthModule {}
