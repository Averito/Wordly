<template>
	<button class="button" @click="onClickLocal"><slot></slot></button>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
	(event: 'click', payload: MouseEvent): void
}>()

const onClickLocal = (event: MouseEvent) => {
	emit('click', event)
}
</script>

<style lang="scss" scoped>
.button {
	position: relative;
	margin: 2.5px;
	color: white;
	background: rgba(66, 66, 66, 0.5);
	border: none;
	padding: clamp(5px, 5vw, 15px) clamp(20px, 8vw, 50px);
	border-radius: 4px;
	cursor: pointer;
	z-index: 1;
	font-size: clamp(14px, 8vw, 24px);
	backdrop-filter: blur(2px);
}
.button::before {
	content: '';
	opacity: 0.5;
	position: absolute;
	z-index: -1;
	left: 0;
	top: 0;
	width: 0;
	height: 100%;
	transition: all 0.3s ease;
	border-radius: 4px;
	background-color: #242424;
}
.button:hover::before {
	width: 100%;
}
.button:active {
	top: 1px;
}
</style>
