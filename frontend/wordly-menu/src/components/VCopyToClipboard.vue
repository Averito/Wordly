<template>
	<div class="container">
		<p class="text">{{ props.text }}</p>

		<button :class="copyContainerClasses" @click="onCopied">
			<svg
				class="copy"
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="currentColor"
			>
				<path
					d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
				/>
			</svg>
		</button>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
	text: string
}>()

const copied = ref(false)

const timeout = ref<ReturnType<typeof setTimeout>>(0)
const copyContainerClasses = computed(() => ({
	copyContainer: true,
	copyContainerCopied: copied.value
}))

const onCopied = async () => {
	if (timeout.value) clearTimeout(timeout.value)

	await window.navigator.clipboard.writeText(props.text)
	copied.value = true

	timeout.value = setTimeout(() => {
		copied.value = false
	}, 2000)
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	border-radius: 6px;
	width: clamp(200px, 100%, 600px);
}

.text {
	display: flex;
	align-items: center;
	width: 100%;
	border: 1px solid #dadada;
	margin: 0;
	padding: 3px 10px 3px 10px;
	white-space: nowrap;
	overflow: auto hidden;
	border-radius: 8px 0 0 8px;

	&::-webkit-scrollbar {
		display: none;
	}
}

.copyContainer {
	position: relative;
	display: flex;
	width: 55px;
	justify-content: center;
	align-items: center;
	padding: 5px 15px;
	cursor: pointer;
	border: 1px solid white;
	border-left: none;
	border-radius: 0 8px 8px 0;
	background-color: transparent;

	&:focus {
		outline: none;
	}

	&:hover .copy {
		color: #dadada;
	}

	&::after {
		position: absolute;
		content: 'Скопировано!';
		top: calc(-100% - 5px);
		left: 50%;
		transform: translateX(-50%);
		opacity: 0;
		transition: opacity 0.3s ease;
		border-radius: 8px;
		padding: 8px 15px;
		pointer-events: none;
		background-color: #343434;
	}

	&Copied {
		&::after {
			opacity: 1;
		}
	}
}

.copy {
	color: white;
	transition: color 0.3s ease;
}
</style>
