import { IsNotEmpty, Max, Min } from 'class-validator'

export class CreateLevelDto {
	@IsNotEmpty()
	@Min(1)
	@Max(50)
	attempts: number

	@IsNotEmpty()
	word: string
}
