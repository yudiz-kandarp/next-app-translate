import { createTranslator } from '../common/get-trans'
import { getLocaleCache } from './get-locale-cache'

export function createGetI18n(locales: any, config?: any) {
	return async function getI18n() {
		const locale = getLocaleCache()
		if (locale) {
			return createTranslator(
				{
					localeContent: flattenLocale((await locales[locale]()).default),
					fallbackLocale: config?.fallbackLocale ? flattenLocale(config.fallbackLocale) : undefined,
					locale,
				},
				undefined
			)
		}
		return null
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
