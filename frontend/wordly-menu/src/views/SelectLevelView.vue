<template>
	<div class="wrapper">
		<div class="level-container">
			<div
				class="level"
				v-for="(level, index) in levels"
				:key="level.id"
				@click="onClickLevel(level.id)"
			>
				{{ index + 1 }}
			</div>
		</div>

		<div class="customLevelCreator">
			<VButton @click="onClickOpenCustomCreator">Создать уровень</VButton>
			<VModal
				:opened="customLevelCreatorModalOpened"
				title="Создание уровня"
				ok-text="Создать"
				@cancel="closeCustomLevelCreatorModal"
				@ok="onClickOkCustomLevelCreatorModal"
				close-outside
			>
				<div class="inputContainer">
					<input type="text" v-model="word" placeholder="Введите слово" />
					<input
						type="number"
						v-model="attempts"
						placeholder="Введите кол-во попыток"
					/>
				</div>
			</VModal>
			<VModal
				:opened="customLevelCreatorModal2Opened"
				title="Поделитесь ссылкой с другом!"
				ok-text="Войти"
				@cancel="closeCustomLevelCreatorModal2"
				@ok="onClickOkCustomLevelCreatorModal2"
				close-outside
			>
				<VCopyToClipboard :text="roomLink" />
			</VModal>
		</div>

		<VButton @click="onClickBack">Назад</VButton>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { ILevel } from '@/api/level/level.types'
import { api } from '@/api'
import { useRouter } from 'vue-router'
import VButton from '@/components/VButton.vue'
import VModal from '@/components/VModal.vue'
import VCopyToClipboard from '@/components/VCopyToClipboard.vue'

const props = defineProps<{
	coop: boolean
}>()

const router = useRouter()

const getRoomLink = (id: string) => {
	const coop = props.coop ? '?socket=on' : ''
	return `${import.meta.env.VITE_MICROFRONTEND_WORDLY_URI}/${id}${coop}`
}

const toLevel = (id: string) => {
	window.location.href = getRoomLink(id)
}

const customLevelCreatorModalOpened = ref(false)
const customLevelCreatorModal2Opened = ref(false)

const openCustomLevelCreatorModal = () => {
	customLevelCreatorModalOpened.value = true
	customLevelCreatorModal2Opened.value = false
}

const openCustomLevelCreatorModal2 = () => {
	customLevelCreatorModalOpened.value = false
	customLevelCreatorModal2Opened.value = true
}

const closeCustomLevelCreatorModal = () => {
	customLevelCreatorModalOpened.value = false
}

const closeCustomLevelCreatorModal2 = () => {
	customLevelCreatorModal2Opened.value = false
}

const word = ref('')
const attempts = ref('6')
const createdLevelId = ref('')

const roomLink = computed(() => getRoomLink(createdLevelId.value))

const onClickOpenCustomCreator = (event: MouseEvent) => {
	event.stopPropagation()
	openCustomLevelCreatorModal()
}

const onClickOkCustomLevelCreatorModal = async () => {
	if (props.coop) {
		const newLevel = await api.level.create(
			parseInt(attempts.value),
			word.value
		)
		createdLevelId.value = newLevel.id
		return openCustomLevelCreatorModal2()
	}
	const newLevel = await api.level.create(parseInt(attempts.value), word.value)
	toLevel(newLevel.id)
}

const onClickOkCustomLevelCreatorModal2 = () => {
	closeCustomLevelCreatorModal2()
	toLevel(createdLevelId.value)
}

const onClickLevel = (levelId: string): void => {
	toLevel(levelId)
}

const onClickBack = () => {
	router.push('/mode')
}

const levels = ref<Array<ILevel>>()

onMounted(async () => {
	levels.value = await api.level.getAll()
})
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.level-container {
	display: flex;
	width: clamp(300px, 60vw, 700px);
	gap: 10px;
	flex-wrap: wrap;
	margin-bottom: 30px;
}

.level {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8px;
	background-color: #242424;
	border: 2px solid white;
	font-size: clamp(14px, 8vw, 40px);
	font-weight: bold;
	width: clamp(30px, 12vw, 50px);
	height: clamp(30px, 12vw, 50px);
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #343434;
	}
}

.customLevelCreator {
	margin-bottom: 15px;
}

.inputContainer {
	display: flex;
	flex-direction: column;
	gap: 15px;

	input {
		background-color: transparent;
		border-radius: 6px;
		padding: 8px 10px;
		border: 1px solid white;

		&:focus {
			outline: none;
		}
	}
}
</style>
