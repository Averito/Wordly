import { BadRequestException, Injectable } from '@nestjs/common'
import { Level } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { CreateLevelDto } from './dto/create.dto'
import { PrismaService } from '../prisma.service'
import { ELevelEvents } from './level.events'
import { LevelDataDto } from './dto/level-data.dto'

@Injectable()
export class LevelService {
	public server: Server = null

	constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateLevelDto): Promise<Level> {
		return this.prismaService.level.create({
			data: {
				attempts: dto.attempts,
				word: dto.word
			}
		})
	}

	public async get(levelId: string): Promise<Level> {
		const level = this.prismaService.level.findUnique({
			where: {
				id: levelId
			}
		})

		if (!level) throw new BadRequestException('Уровень не найден.')

		return level
	}

	public async getAll(): Promise<Array<Level>> {
		return this.prismaService.level.findMany({
			where: {
				isUserCreated: false
			}
		})
	}

	public async join(socket: Socket, roomId: string): Promise<void> {
		const clients = this.getClients(roomId)
		if (clients.length >= 2) throw new BadRequestException('Места заняты.')

		clients.forEach((clientId: string) => {
			this.server.to(clientId).emit(ELevelEvents.JOINED)
		})

		socket.join(roomId)
	}

	public async sendQueue(socket: Socket, roomId: string): Promise<void> {
		const clients = this.getClients(roomId)

		clients.forEach((clientId: string) => {
			if (clientId === socket.id) return
			this.server.to(clientId).emit(ELevelEvents.GET_QUEUE)
		})
	}

	public async sendLevelData(
		socket: Socket,
		levelData: LevelDataDto
	): Promise<void> {
		const clients = this.getClients(levelData.roomId)

		clients.forEach((clientId: string) => {
			if (clientId === socket.id) return
			this.server
				.to(clientId)
				.emit(ELevelEvents.SEND_LEVEL_DATA, { words: levelData.words })
		})
	}

	public async leave(socket: Socket, roomId: string): Promise<void> {
		const clients = this.getClients(roomId)

		clients.forEach((clientId: string) => {
			this.server.to(clientId).emit(ELevelEvents.LEAVED)
		})

		socket.leave(roomId)
	}

	private getClients(roomId: string) {
		return Array.from((this.server as any).adapter?.rooms?.get(roomId) || [])
	}
}
