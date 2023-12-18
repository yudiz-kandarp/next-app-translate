import 'next/headers'
import { cache } from 'react'

const localeLang: any = {
	current: '',
	v: '',
}

const getLocale = cache<() => { current: string | undefined }>(() => ({ current: undefined }))
const getStaticParamsLocale = () => {
	localeLang.v = new Date()
	return localeLang.current || getLocale().current
}

export const setStaticParamsLocale = (value: string) => {
	if (!getLocale().current || value !== getLocale().current) {
		localeLang.current = value
		getLocale().current = value
	}
}

export const getLocaleCache = (defaultLocale: string | undefined) => {
	let locale: string | undefined | null

	locale = getStaticParamsLocale() || defaultLocale

	if (!locale) {
		throw new Error('Could not find locale while rendering page, make sure you called `setStaticParamsLocale` at the top of your pages')
	}

	return locale
}
