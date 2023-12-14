import 'server-only'

import { createGetI18n } from './create-get-i18n'

export { setStaticParamsLocale } from './get-locale-cache'

export type Locale = {
  [key: string]: () => Promise<any>;
};

export function createI18nServer(locales: Locale, config?: any) {
	if(locales && Object.keys(locales).length === 0) {
		throw new Error('Please add at least one locale')
	}
	const getI18n = createGetI18n(locales, config)

	return {
		getI18n,
	}
}
