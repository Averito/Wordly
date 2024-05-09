import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ModeView from '@/views/ModeView.vue'
import SelectLevelView from '@/views/SelectLevelView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/mode',
			name: 'mode',
			component: ModeView
		},
		{
			path: '/mode/solo',
			name: 'solo mode',
			props: {
				coop: false
			},
			component: SelectLevelView
		},
		{
			path: '/mode/co-op',
			name: 'co-op mode',
			props: {
				coop: true
			},
			component: SelectLevelView
		}
	]
})

export default router
