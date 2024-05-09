import { useParams, useSearchParams } from 'react-router-dom'
import {
	ChangeEventHandler,
	CSSProperties,
	FC,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react'
import { socket } from '../../utils/socket.ts'
import { EWordlyEvents } from './Wordly.types.ts'
import { ILevel } from '../../api/level/level.types.ts'
import { api } from '../../api'
import styles from './Wordly.module.scss'
import { EMatch, useMatches } from './hooks/useMatches.ts'
import classNames from 'classnames'
import Modal from '../modal/Modal.tsx'
import { findTruthyRow } from './helpers/findTruthyRow.ts'

export const Wordly: FC = () => {
	const searchParams = useSearchParams()
	const params = useParams()

	const inputs = useRef<HTMLInputElement[]>([])

	const [myOrder, setMyOrder] = useState<boolean>(false)
	const [userWaitModalOpened, setUserWaitModalOpened] = useState<boolean>(false)
	const [level, setLevel] = useState<ILevel>({} as ILevel)
	const [words, setWords] = useState<Array<string>>([])
	const [disabledLayers, setDisabledLayers] = useState<boolean[]>([])
	const [currentInputFocusIndex, setCurrentInputFocusIndex] =
		useState<number>(-1)

	useEffect(() => {
		if (!searchParams[0].has('socket')) {
			setMyOrder(true)
			return
		}
		setUserWaitModalOpened(true)
	}, [])

	useEffect(() => {
		const asyncWrapper = async () => {
			try {
				const level = await api.level.getById(params.id as string)
				setLevel(level)
				setWords(
					Array.from({ length: level.attempts }, () =>
						' '.repeat(level.word.length)
					)
				)
				setDisabledLayers(new Array(level.attempts).fill(false))
			} catch {
				window.location.href = import.meta.env.VITE_MAIN_PAGE
			}
		}

		void asyncWrapper()
	}, [])

	useEffect(() => {
		if (!searchParams[0].has('socket')) return

		socket.emit(EWordlyEvents.JOIN, params.id)

		return () => {
			socket.emit(EWordlyEvents.LEAVE, params.id)
		}
	}, [])

	useEffect(() => {
		if (!searchParams[0].has('socket')) return

		socket.on(EWordlyEvents.JOINED, () => {
			setUserWaitModalOpened(false)
			setMyOrder(true)
			socket.emit(EWordlyEvents.SEND_LEVEL_DATA, {
				words,
				roomId: params.id
			})
		})
		socket.on(EWordlyEvents.LEAVED, () => {
			setUserWaitModalOpened(true)
		})
		socket.on(
			EWordlyEvents.SEND_LEVEL_DATA,
			(levelData: { words: string[] }) => {
				setUserWaitModalOpened(false)
				setWords(levelData.words)
			}
		)
		socket.on(EWordlyEvents.GET_QUEUE, () => {
			setMyOrder(true)
		})

		return () => {
			socket.off(EWordlyEvents.JOINED)
			socket.off(EWordlyEvents.LEAVED)
			socket.off(EWordlyEvents.SEND_LEVEL_DATA)
			socket.off(EWordlyEvents.GET_QUEUE)
		}
	}, [words])

	const getIndexInRow = (index: number) => index % (level.word || '').length
	const getIndexInColumn = (index: number) =>
		Math.floor(index / (level.word || '').length)

	const provideInputs = (index: number) => (input: HTMLInputElement | null) => {
		if (!input) return
		inputs.current[index] = input
	}

	const incrementCurrentFocus = (onSuccess: () => void) => {
		setCurrentInputFocusIndex(prevState => {
			if (prevState + 1 >= (level.attempts || 0) * (level.word || '').length)
				return -1
			const currentIndexInColumn = getIndexInColumn(prevState)
			const nextIndexInColumn = getIndexInColumn(prevState + 1)

			if (currentIndexInColumn !== nextIndexInColumn) return prevState
			onSuccess()
			return prevState + 1
		})
	}

	const decrementCurrentFocus = (onSuccess: () => void) => {
		setCurrentInputFocusIndex(prevState => {
			if (prevState - 1 < 0) return 0
			const indexInColumn = getIndexInColumn(prevState - 1)
			if (disabledLayers[indexInColumn]) return prevState
			onSuccess()
			return prevState - 1
		})
	}

	const updateWordsChar = (index: number, value: string) => {
		if (index < 0) return

		const indexInRow = getIndexInRow(index)
		const indexInColumn = getIndexInColumn(index)

		setWords(prevState => {
			const newWords = [...prevState]
			const splittedWord = (newWords[indexInColumn] || '').split('')
			splittedWord[indexInRow] = value
			newWords[indexInColumn] = splittedWord.join('')

			socket.emit(EWordlyEvents.SEND_LEVEL_DATA, {
				words: newWords,
				roomId: params.id
			})

			return newWords
		})
	}

	const onFocusInput = (index: number) => {
		return () => {
			const firstNotDisabledIndex = disabledLayers.indexOf(false)
			const indexOfRow = getIndexInRow(index)

			const realFocusIndex =
				firstNotDisabledIndex * (level.word || '').length + indexOfRow

			setCurrentInputFocusIndex(realFocusIndex)
			inputs.current[realFocusIndex].focus()
		}
	}

	const stopInput = useRef<boolean>(false)

	const onChangeInput = (
		index: number
	): ChangeEventHandler<HTMLInputElement> => {
		return event => {
			const value = event.currentTarget.value
			if (value.length === 0 || !myOrder) return

			const lastChar = value.charAt(value.length - 1)

			updateWordsChar(index, lastChar)

			if (currentInputFocusIndex + 1 >= inputs.current.length)
				stopInput.current = true
			if (stopInput.current) return

			incrementCurrentFocus(() => {
				inputs.current[currentInputFocusIndex + 1]?.focus?.()
			})
		}
	}

	const onKeyDownBackspace = (
		index: number
	): KeyboardEventHandler<HTMLInputElement> => {
		return event => {
			const isLeft = event.key === 'ArrowLeft'
			const isRight = event.key === 'ArrowRight'

			if (isLeft || isRight) {
				if (isLeft) {
					decrementCurrentFocus(() => {
						inputs.current[currentInputFocusIndex - 1]?.focus?.()
					})
				}

				if (isRight) {
					incrementCurrentFocus(() => {
						inputs.current[currentInputFocusIndex + 1]?.focus?.()
					})
				}
			}

			const isRemove = event.key === 'Backspace' || event.key === 'Delete'
			if (!isRemove) return
			stopInput.current = false

			const currentColumn = getIndexInColumn(index)
			const prevColumn = getIndexInColumn(index - 1)

			if (!event.currentTarget.value.trim() && currentColumn === prevColumn) {
				updateWordsChar(index - 1, ' ')
			} else {
				updateWordsChar(index, ' ')
			}

			if (currentInputFocusIndex < 0) return

			decrementCurrentFocus(() => {
				inputs.current[currentInputFocusIndex - 1].focus()
			})
		}
	}

	const isWordCorrect = async (word: string): Promise<boolean> => {
		if (word.trim().length !== (level.word || '').length) return false
		if (word.toLowerCase() === (level.word || '').toLowerCase()) return true

		const correctWord = await api.dictionary.getWord(word)
		return (correctWord.def || []).length > 0
	}

	useEffect(() => {
		const asyncWrapper = async () => {
			for (const word of words) {
				const index = words.indexOf(word)

				if (!word.trim()) continue

				const wordIsCorrect = await isWordCorrect(word)
				if (!wordIsCorrect) {
					continue
				}

				if (disabledLayers[index]) continue

				if (searchParams[0].has('socket') && myOrder) {
					setMyOrder(false)
					socket.emit(EWordlyEvents.SEND_QUEUE, params.id)
				}

				setDisabledLayers(prevState => {
					const newState = [...prevState]
					newState[index] = true
					return newState
				})
			}
		}

		void asyncWrapper()
	}, [words, disabledLayers])

	useEffect(() => {
		if (searchParams[0].has('socket') || !level) return

		const cachedWords = localStorage.getItem(params.id as string)
		if (!cachedWords) return

		setWords(JSON.parse(cachedWords))
	}, [level])

	useEffect(() => {
		if (searchParams[0].has('socket') || !level || words.length === 0) return
		localStorage.setItem(params.id as string, JSON.stringify(words))
	}, [words, level])

	const { matches } = useMatches(words, level.word)

	const [customWinnerModalOpened, setCustomWinnerModalOpened] =
		useState<boolean>(true)
	const [customLoserModalOpened, setCustomLoserModalOpened] =
		useState<boolean>(true)

	const closeWinnerModal = () => {
		setCustomWinnerModalOpened(false)
	}
	const closeLoserModal = () => {
		setCustomLoserModalOpened(false)
	}

	const onOkWinnerModal = () => {
		closeWinnerModal()
		window.location.href = import.meta.env.VITE_HOME_PAGE
	}

	const onOkLoserModal = () => {
		closeLoserModal()
		window.location.href = import.meta.env.VITE_HOME_PAGE
	}

	const winnerModalOpened =
		findTruthyRow(matches) !== -1 && customWinnerModalOpened

	const loserModalOpened =
		!!level.id &&
		disabledLayers.indexOf(false) === -1 &&
		findTruthyRow(matches) === -1 &&
		customLoserModalOpened

	const iterateArray = Array.from(
		{ length: (level.attempts || 0) * (level.word || '').length },
		(_, index) => index + 1
	)

	const boardCols: CSSProperties = {
		gridTemplateColumns: `repeat(${(level.word || '').length}, 1fr)`
	}

	return (
		<>
			<Modal
				opened={userWaitModalOpened}
				title='Ожидание игроков...'
				okText=''
			/>
			<Modal
				opened={winnerModalOpened}
				onOk={onOkWinnerModal}
				onCancel={closeWinnerModal}
				title='Победа!'
				okText='В главное меню'
			>
				<p>Вы угадали! Было загадано слово - {level.word}</p>
			</Modal>
			<Modal
				opened={loserModalOpened}
				onOk={onOkLoserModal}
				onCancel={closeLoserModal}
				title='Вы проиграли...'
				okText='В главное меню'
			>
				<p>
					Вы не сумели отгадать слово, вы проиграли и можете вернуться на
					главную страницу.
				</p>
			</Modal>
			<div className={styles.container}>
				<div className={styles.gridBoard} style={boardCols}>
					{iterateArray.map((_, index) => {
						const indexInColumn = getIndexInColumn(index)
						const indexInRow = getIndexInRow(index)
						const currentMatch =
							matches?.[indexInColumn]?.[indexInRow] || EMatch.NOT_GUESSED

						return (
							<div
								className={classNames(styles.cell, {
									[styles.cellGuessed]:
										currentMatch === EMatch.GUESSED &&
										disabledLayers[indexInColumn],
									[styles.cellFullGuessed]:
										currentMatch === EMatch.FULL_GUESSED &&
										disabledLayers[indexInColumn]
								})}
								key={index}
								onFocus={onFocusInput(index)}
							>
								<input
									type='text'
									onChange={onChangeInput(index)}
									onKeyDown={onKeyDownBackspace(index)}
									disabled={disabledLayers[indexInColumn] ?? false}
									value={(words?.[indexInColumn]?.[indexInRow] || '')
										.trim()
										.toUpperCase()}
									ref={provideInputs(index)}
								/>
							</div>
						)
					})}
				</div>
				{searchParams[0].has('socket') && (
					<div className={styles.queueContainer}>
						<p>{myOrder ? 'Ваша очередь.' : 'Ожидаем слово игрока...'}</p>
					</div>
				)}
				<div className={styles.infoContainer}>
					<div className={styles.info}>
						<div className={styles.infoGuessed} />
						<p>- Вы угадали букву, но не её позицию.</p>
					</div>
					<div className={styles.info}>
						<div className={styles.infoFullGuessed} />
						<p>- Вы угадали букву и её позицию.</p>
					</div>
				</div>
			</div>
		</>
	)
}
