import { Module } from '@nestjs/common'
import { LevelModule } from './level/level.module'
import { PrismaService } from './prisma.service'

@Module({
	imports: [LevelModule],
	controllers: [],
	providers: [PrismaService]
})
export class AppModule {}
