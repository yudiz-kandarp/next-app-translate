import type { Context, ReactNode } from 'react'
import React, { Suspense, useMemo } from 'react'

type I18nProviderProps = Omit<I18nProviderWrapperProps, 'fallback'>

type I18nProviderWrapperProps = {
	locale: string
	fallback?: ReactNode
	children: ReactNode
}

export const localesCache = new Map<string, Record<string, unknown>>()

export function createI18nProviderClient(I18nClientContext: Context<any>, locales: any, fallbackLocale?: Record<string, unknown>) {
	function I18nProvider({ locale, children }: I18nProviderProps) {
		let clientLocale: any = localesCache.get(locale)

		if (!clientLocale) {
			const newLocale = locales[locale as keyof typeof locales]
			newLocale()?.then((module: any) => {
				clientLocale = module.default
				localesCache.set(locale, module.default)
			})
		}

		const value = useMemo(
			() => ({
				localeContent: clientLocale ? flattenLocale(clientLocale) : {},
				fallbackLocale: fallbackLocale ? flattenLocale(fallbackLocale) : undefined,
				locale: locale as string,
			}),
			[clientLocale, locale]
		)

		return <I18nClientContext.Provider value={value}>{children}</I18nClientContext.Provider>
	}

	return function I18nProviderWrapper({ locale, fallback, children }: I18nProviderWrapperProps) {
		return (
			<Suspense fallback={fallback}>
				<I18nProvider locale={locale}>{children}</I18nProvider>
			</Suspense>
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
