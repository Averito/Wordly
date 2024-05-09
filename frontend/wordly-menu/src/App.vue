<script setup lang="ts">
import { RouterView } from 'vue-router'
import './assets/base.css'
import './assets/main.css'
</script>

<template>
	<main class="wrapper">
		<h1 class="title">Wordly <sub>by Averito</sub></h1>
		<RouterView />
	</main>
</template>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 20px 15px;
}

.title {
	font-size: clamp(24px, 10vw, 54px);
	font-weight: bold;
	margin-bottom: clamp(15px, 10vw, 40px);

	sub {
		margin-left: -8px;
		font-size: clamp(8px, 5vw, 20px);
	}
}
</style>
