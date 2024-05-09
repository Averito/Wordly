<template>
	<div class="container">
		<VButton @click="onClickSolo">В одиночку</VButton>
		<VButton @click="onClickCoop">По локальной сети</VButton>
		<VButton @click="onClickBack">Назад</VButton>
	</div>
</template>

<script lang="ts" setup>
import VButton from '@/components/VButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const onClickSolo = () => {
	router.push('/mode/solo')
}

const onClickCoop = () => {
	router.push('/mode/co-op')
}

const onClickBack = () => {
	router.push('/')
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 15px;
}
</style>
