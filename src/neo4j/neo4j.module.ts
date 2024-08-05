import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { neo4jConfig } from '../config/neo4j.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    Neo4jModule.forRootAsync(neo4jConfig),
  ],
})
export class Neo4jDatabaseModule {}
