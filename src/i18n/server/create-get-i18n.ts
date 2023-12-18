import { createTranslator } from '../common/get-trans'
import { Locale } from './create-18n-server'
import { getLocaleCache } from './get-locale-cache'

export function createGetI18n(locales: Locale, config?: any) {
	return async function getI18n() {
		const locale = getLocaleCache(config?.defaultLocale)

		return createTranslator(
			{
				localeContent: locale ? flattenLocale((await locales[locale]()).default) : {},
				fallbackLocale: config?.fallbackLocale ? flattenLocale(config.fallbackLocale) : undefined,
				locale,
			},
			undefined
		)
	}
}

const flattenLocale = (locale: Record<string, unknown>, prefix = ''): any =>
	Object.entries(locale).reduce(
		(prev, [name, value]) => ({
			...prev,
			...(typeof value === 'string' ? { [prefix + name]: value } : flattenLocale(value as unknown as any, `${prefix}${name}.`)),
		}),
		{}
	)
