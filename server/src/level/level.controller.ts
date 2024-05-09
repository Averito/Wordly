import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { LevelService } from './level.service'
import { CreateLevelDto } from './dto/create.dto'
import { Level } from '@prisma/client'

@Controller('level')
export class LevelController {
	constructor(private readonly levelService: LevelService) {}

	@Post()
	public async create(@Body() createLevelDto: CreateLevelDto): Promise<Level> {
		return this.levelService.create(createLevelDto)
	}

	@Get('')
	public async getAll(): Promise<Array<Level>> {
		return this.levelService.getAll()
	}

	@Get(':id')
	public async get(@Param('id') levelId: string): Promise<Level> {
		return this.levelService.get(levelId)
	}
}
