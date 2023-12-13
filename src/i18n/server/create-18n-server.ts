import 'server-only'

import { createGetI18n } from './create-get-i18n'

export { setStaticParamsLocale } from './get-locale-cache'

export function createI18nServer(locales: any, config?: any) {
	const getI18n = createGetI18n(locales, config)

	return {
		getI18n,
	}
}
