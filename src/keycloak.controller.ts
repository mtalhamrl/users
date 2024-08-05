import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleGuard } from 'nest-keycloak-connect';

@Controller('users')
@UseGuards(RoleGuard)
export class KeycloakController {
  @Get('/get')
  findAll() {
    return 'This route is restricted to users with the "user" role.';
  }
}
