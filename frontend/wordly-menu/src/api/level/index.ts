import axios from 'axios'
import type { ILevel } from './level.types'

const baseUrl = import.meta.env.VITE_BACKEND_URL

export const level = {
	async getAll(): Promise<Array<ILevel>> {
		return axios
			.get<Array<ILevel>>(`${baseUrl}/level`)
			.then(response => response.data)
	},
	async create(attempts: number, word: string): Promise<ILevel> {
		return axios
			.post(`${baseUrl}/level`, { attempts, word })
			.then(response => response.data)
	}
}
