import type { ObjectDirective } from 'vue'

export interface IOnClickOutsideElement extends HTMLElement {
	clickOutsideHandler: (e: MouseEvent | TouchEvent) => void
}

export type TOnClickOutsideDirectiveBinding<T = any> = (
	event: MouseEvent | TouchEvent
) => T

declare const vOnClickOutside: ObjectDirective<
	IOnClickOutsideElement,
	TOnClickOutsideDirectiveBinding
>

export default vOnClickOutside
