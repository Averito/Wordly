import { Module } from '@nestjs/common'
import { LevelController } from './level.controller'
import { LevelService } from './level.service'
import { LevelGateway } from './level.gateway'
import { PrismaService } from '../prisma.service'

@Module({
	controllers: [LevelController],
	providers: [LevelService, LevelGateway, PrismaService]
})
export class LevelModule {}
