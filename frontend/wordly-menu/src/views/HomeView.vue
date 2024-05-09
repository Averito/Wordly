<template>
	<VButton @click="onClickPlay">Играть</VButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import VButton from '@/components/VButton.vue'

const router = useRouter()

const onClickPlay = () => {
	router.push('/mode')
}
</script>
