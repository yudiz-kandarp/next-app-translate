import 'client-only'
import { createI18nProviderClient } from './create-i18n-provider-client'
import { createContext } from 'react'
import { createUsei18n } from './create-use-i18n'

export function createI18nClient(locales: any, config: any = {}) {
	const I18nClientContext = createContext<any>(null)

	const I18nProviderClient = createI18nProviderClient(I18nClientContext, locales, config.fallbackLocale)
	const useI18n = createUsei18n(I18nClientContext)

	return {
		useI18n,
		I18nProviderClient,
		I18nClientContext,
	}
}
