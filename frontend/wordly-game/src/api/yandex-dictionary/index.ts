import axios from 'axios'
import { IYandexDictionary } from './yandex-dictionary.types.ts'

const dictionaryUri = import.meta.env.VITE_YANDEX_DICTIONARY_URI
const apiKey = import.meta.env.VITE_YANDEX_DICTIONARY_API_KEY

export const dictionary = {
	async getWord(word: string): Promise<IYandexDictionary> {
		return axios
			.get<IYandexDictionary>(
				`${dictionaryUri}/lookup?key=${apiKey}&lang=ru-ru&text=${word}`
			)
			.then(response => response.data)
	}
}
