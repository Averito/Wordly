import type {
	IOnClickOutsideElement,
	TOnClickOutsideDirectiveBinding
} from './OnClickOutside.types'
import type { DirectiveBinding } from 'vue'

export default {
	name: 'onClickOutside',
	mounted(
		el: IOnClickOutsideElement,
		binding: DirectiveBinding<TOnClickOutsideDirectiveBinding>
	) {
		if (!binding.value) {
			throw new Error(
				'[OnClickOutside]: directive does not have a handler binding.'
			)
		}

		el.clickOutsideHandler = function (e: MouseEvent | TouchEvent) {
			e.stopPropagation()

			if (el !== e.target && !el.contains(e.target as Node)) {
				binding.value(e)
			}
		}

		document.body.addEventListener('click', el.clickOutsideHandler)
	},

	unmounted(el: IOnClickOutsideElement) {
		document.body.removeEventListener('click', el.clickOutsideHandler)
	}
}
