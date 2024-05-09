<template>
	<Teleport to="body">
		<div :class="modalContainerClass">
			<div
				class="modalWrapper"
				v-on-click-outside="onOutsideHandler"
				:style="`width: ${width}`"
			>
				<div class="modalHeader">
					<h2 class="title">{{ title }}</h2>
				</div>
				<div v-if="$slots.default" class="modalContent">
					<slot></slot>
				</div>

				<div class="modalBottom">
					<VButton v-if="props.okText" @click="onClickOk">
						{{ okText }}
					</VButton>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import vOnClickOutside from '@/directives/onClickOutside/OnClickOutside'
import VButton from '@/components/VButton.vue'

const props = withDefaults(
	defineProps<{
		opened: boolean
		title?: string
		okText?: string
		width?: string
		closeOutside?: boolean
	}>(),
	{
		okText: 'Ок',
		title: 'Заголовок',
		width: '100%'
	}
)

const emit = defineEmits<{
	(event: 'cancel'): void
	(event: 'ok'): void
}>()

const onClickOk = () => {
	emit('ok')
}

const onOutsideHandler = () => {
	if (!props.closeOutside || !props.opened) return
	emit('cancel')
}

watch(
	() => props.opened,
	newOpened => {
		if (newOpened) {
			document.body.style.overflow = 'hidden'
			return
		}
		document.body.style.overflow = 'hidden auto'

		return () => {
			document.body.style.overflow = 'hidden auto'
		}
	}
)

const modalContainerClass = computed(() => ({
	modalContainer: true,
	modalContainerActive: props.opened
}))
</script>

<style lang="scss" scoped>
.modalContainer {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1001;
	width: 100vw;
	height: 100vh;
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;
	padding: 15px;
	overflow: hidden;
	transition: background-color 0.2s ease;

	@media all and (max-width: 768px) {
		padding: 10px;
	}
}

.modalWrapper {
	opacity: 0;
	background-color: #242424;
	border-radius: 10px;
	max-width: clamp(200px, 80vw, 600px);
	transition: opacity 0.3s ease;
}

.modalContainerActive {
	pointer-events: auto;
	background-color: rgba(0, 0, 0, 0.5);

	> .modalWrapper {
		opacity: 1;
	}
}

.modalHeader {
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid rgba(217, 217, 217, 0.52);
	padding: 20px 24px;
}

.title {
	font-size: 20px;
	color: white;
}

.closeIcon {
	cursor: pointer;
}

.modalContent {
	padding: 15px;

	@media all and (max-width: 768px) {
		padding: 10px;
	}
}

.modalBottom {
	justify-content: flex-end;
	border-top: 1px solid rgba(217, 217, 217, 0.52);
	padding: 15px 20px;

	button {
		padding: 8px 25px;
	}
}

.modalHeader,
.modalBottom {
	display: flex;

	@media all and (max-width: 768px) {
		padding: 10px 12px;
	}
}

.modalBottomButton {
	cursor: pointer;
	font-size: 18px;
	padding: 5px 20px;
	max-width: fit-content;
}
</style>
