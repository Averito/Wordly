import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'

const PORT = parseInt(process.env.PORT) || 5001

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: true
	})

	await app.listen(PORT)

	console.log(`Server started on port ${PORT}`)
}

void bootstrap()
