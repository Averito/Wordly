import axios from 'axios'
import { ILevel } from './level.types.ts'

const baseUrl = import.meta.env.VITE_BACKEND_URL

export const level = {
	async getById(levelId: string): Promise<ILevel> {
		return axios
			.get(`${baseUrl}/level/${levelId}`)
			.then(response => response.data)
	}
}
