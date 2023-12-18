const getLocale: { current: undefined | string } = {
	current: undefined,
}
// const getLocale: () => { current: undefined | string } = () => ({ current: undefined })
const getStaticParamsLocale = () => getLocale.current

export const setStaticParamsLocale = (value: string) => {
	getLocale.current = value
}

export const getLocaleCache = () => {
	let locale: string | undefined | null

	locale = getStaticParamsLocale()

	if (!locale) {
		throw new Error('Could not find locale while rendering page, make sure you called `setStaticParamsLocale` at the top of your pages')
	}

	return locale
}
