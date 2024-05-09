import { useEffect, useState } from 'react'

export enum EMatch {
	NOT_GUESSED,
	GUESSED,
	FULL_GUESSED
}

export interface IUseMatchesReturn {
	matches: EMatch[][]
}

export const useMatches = (
	words: string[],
	word: string
): IUseMatchesReturn => {
	const [matches, setMatches] = useState<number[][]>([])

	useEffect(() => {
		if (words.length === 0 || !word) return
		let newMatches: number[][] = []

		words.forEach((inputWord, index) => {
			newMatches[index] = []

			for (let i = 0; i < inputWord.length; i++) {
				const currentColumn = newMatches[index]
				const wordChar = (word?.[i] || '').toLowerCase()
				const inputWordChar = (inputWord?.[i] || '').toLowerCase()

				if (
					word.toLowerCase().includes(inputWordChar) &&
					wordChar !== inputWordChar
				) {
					currentColumn[i] = EMatch.GUESSED
					continue
				}
				if (wordChar === inputWordChar) {
					currentColumn[i] = EMatch.FULL_GUESSED
					continue
				}

				currentColumn[i] = EMatch.NOT_GUESSED
			}
		})

		setMatches(newMatches)
	}, [words, word])

	return { matches }
}
