import { EMatch } from '../hooks/useMatches.ts'

export const findTruthyRow = (matches: EMatch[][]): number => {
	let truthyRowIndex = -1

	matches.forEach((match, index) => {
		if (truthyRowIndex !== -1) return

		const isTruthyLayer = match.reduce(
			(acc, matchValue) => acc && matchValue === EMatch.FULL_GUESSED,
			true
		)

		if (!isTruthyLayer) return
		truthyRowIndex = index
	})

	return truthyRowIndex
}
