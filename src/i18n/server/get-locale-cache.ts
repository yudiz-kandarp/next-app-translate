import { cookies, headers } from 'next/headers'
import { cache } from 'react'

const getLocale = cache<() => { current: string | undefined }>(() => ({ current: undefined }))
const getStaticParamsLocale = () => getLocale().current

export const setStaticParamsLocale = (value: string) => {
	getLocale().current = value
}

export const getLocaleCache = cache(() => {
	let locale: string | undefined | null

	locale = getStaticParamsLocale()

	if (!locale) {
		try {
			locale = headers().get('X-Next-Lang')

			if (!locale) {
				locale = cookies().get('Next-Lang')?.value
			}
		} catch (e) {
			throw new Error(
				'Could not find locale while pre-rendering page, make sure you called `setStaticParamsLocale` at the top of your pages'
			)
		}
	}

	return locale
})
