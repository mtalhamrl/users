import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jDatabaseModule } from './neo4j/neo4j.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, Neo4jDatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
