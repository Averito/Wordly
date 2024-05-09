import {
	ConnectedSocket,
	MessageBody,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ELevelEvents } from './level.events'
import { LevelService } from './level.service'
import { LevelDataDto } from './dto/level-data.dto'

@WebSocketGateway({
	namespace: 'level/ws',
	transports: ['websocket'],
	connectTimeout: 10000,
	cors: true
})
export class LevelGateway implements OnGatewayInit {
	constructor(private readonly levelService: LevelService) {}

	afterInit(server: Server) {
		this.levelService.server = server
	}

	@SubscribeMessage(ELevelEvents.JOIN)
	public async onJoin(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: string
	): Promise<void> {
		return this.levelService.join(socket, roomId)
	}

	@SubscribeMessage(ELevelEvents.LEAVE)
	public async onLeave(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: string
	): Promise<void> {
		return this.levelService.leave(socket, roomId)
	}

	@SubscribeMessage(ELevelEvents.SEND_LEVEL_DATA)
	public async onSendLevelData(
		@ConnectedSocket() socket: Socket,
		@MessageBody() levelDataDto: LevelDataDto
	): Promise<void> {
		return this.levelService.sendLevelData(socket, levelDataDto)
	}

	@SubscribeMessage(ELevelEvents.SEND_QUEUE)
	public async onSendQueue(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: string
	): Promise<void> {
		return this.levelService.sendQueue(socket, roomId)
	}
}
