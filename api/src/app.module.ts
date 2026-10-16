import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SnippetsModule } from './snippit/snippets.module.js';
import { TagsModule } from './tags/tags.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SnippetsModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}