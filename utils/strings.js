import LocalizedStrings from 'react-localization'
import { defaultsDeep } from 'lodash'
import english from '../public/static/labels/english'

export const locales = {
	en: {
		displayName: 'English',
		localeCode: 'en',
		labels: english,
	},
	cn: {
		displayName: 'Chinese',
		localeCode: 'cn',
		labels: () => import(`public/static/labels/chinese`),
	},
}

export const strings =
	new LocalizedStrings({
		default: locales.en.labels,
	}) || english

export const getLocaleStrings = async ({ locale }) => {
	if (locale === 'en' || !(locale in locales)) {
		return english
	}
	const localeStrings = locales[locale].labels().then((l) => l.default)
	return defaultsDeep(localeStrings, english)
}
