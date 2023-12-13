import type { Context } from 'react'
import { useContext } from 'react'
import { createTranslator } from '../common/get-trans'

export function createUsei18n(I18nClientContext: Context<any>) {
	return function useI18n() {
		const context = useContext(I18nClientContext)

		if (!context) {
			throw new Error('`useI18n` must be used inside `I18nProvider`')
		}

		return createTranslator(context, undefined)
	}
}
