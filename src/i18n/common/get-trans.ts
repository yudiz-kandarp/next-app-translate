import type { ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'
import { isDev } from '.'

export function createTranslator(context: any, scope?: any) {
	const { localeContent, fallbackLocale } = context

	const content = fallbackLocale && typeof localeContent === 'string' ? fallbackLocale : Object.assign(fallbackLocale ?? {}, localeContent)

	const pluralKeys = new Set(
		Object.keys(content)
			.filter((key) => key.includes('#'))
			.map((key) => key.split('#', 1)[0])
	)

	const pluralRules = new Intl.PluralRules(context.locale)

	function getPluralKey(count: number) {
		if (count === 0) return 'zero'
		return pluralRules.select(count)
	}

	function t(key: string, ...params: any) {
		const paramObject = params[0]
		let isPlural = false

		if (paramObject && 'count' in paramObject) {
			const isPluralKey = scope ? pluralKeys.has(`${scope}.${key}`) : pluralKeys.has(key)

			if (isPluralKey) {
				key = `${key}#${getPluralKey(paramObject.count)}`
				isPlural = true
			}
		}

		let value = scope ? content[`${scope}.${key}`] : content[key]
		if (!value && isDev) {
			console.warn(`"${key}" is missing in locale file of "${context.locale}"`)
		}
		if (!value && isPlural) {
			const baseKey = key.split('#', 1)[0]
			value = (content[`${baseKey}#other`] || key)?.toString()
		} else {
			value = (value || key)?.toString()
		}

		if (!paramObject) {
			return value
		}

		let isString = true

		const result = value?.split(/({[^}]*})/).map((part: string, index: number) => {
			const match = part.match(/{(.*)}/)

			if (match) {
				const param = match[1] as any
				const paramValue = (paramObject as any)[param]

				if (isValidElement(paramValue)) {
					isString = false
					return cloneElement(paramValue, { key: `${String(param)}-${index}` })
				}

				return paramValue as ReactNode
			}

			return part
		})

		return isString ? result?.join('') : result
	}

	return t
}
