import 'server-only'

import { createGetI18n } from './create-get-i18n'

import { setStaticParamsLocale } from './get-locale-cache'

export type Locale = {
	[key: string]: () => Promise<any>
}

function changeServerLocale(locale: string) {
	setStaticParamsLocale(locale)
}

export function createI18nServer(locales: Locale, config: { defaultLocale: string } & Record<string, any>) {
	if (locales && Object.keys(locales).length === 0) {
		throw new Error('Please add at least one locale')
	}
	const getI18n = createGetI18n(locales, config)

	return {
		getI18n,
		changeServerLocale,
	}
}
