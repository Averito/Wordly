export interface IYandexDictionaryWord {
	text: string
	pos: string
	fr?: number
	tr?: Array<IYandexDictionaryWord>
	syn?: Array<IYandexDictionaryWord>
}
export interface IYandexDictionary {
	def: Array<IYandexDictionaryWord>
}
