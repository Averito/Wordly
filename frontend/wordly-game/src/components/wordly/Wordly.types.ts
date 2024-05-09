export enum EWordlyEvents {
	JOIN = 'JOIN',
	JOINED = 'JOINED',
	LEAVE = 'LEAVE',
	LEAVED = 'LEAVED',
	SEND_LEVEL_DATA = 'SEND_LEVEL_DATA',
	SEND_QUEUE = 'SEND_QUEUE',
	GET_QUEUE = 'GET_QUEUE'
}

export interface IWordlyData {
	words: string[]
}