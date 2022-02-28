export * from './en'
export * from './zh'
export * from './es'
export * from './ru'
export * from './fr'

export function getLanguage() {
	let lang = navigator.language || navigator.userLanguage
	let localLang = getLocale(lang)
	const localStorageLang = localStorage.getItem('lang')
	const defaultLang = localStorageLang || localLang
	return defaultLang
}
/* export function changeHtmlLang(lang) {
    return document.getElementById('lang').lang = lang;
} */
export function setLanguage(lang) {
	const defaultLang = localStorage.setItem('lang', lang)
	return defaultLang
}

/* 
		["af", "sq", "ar-SA", "ar-IQ", "ar-EG", "ar-LY", "ar-DZ", "ar-MA", "ar-TN", "ar-OM", 
		"ar-YE", "ar-SY", "ar-JO", "ar-LB", "ar-KW", "ar-AE", "ar-BH", "ar-QA", "eu", "bg", 
		"be", "ca", "zh-TW", "zh-CN", "zh-HK", "zh-SG", "hr", "cs", "da", "nl", "nl-BE", "en", 
		"en-US", "en-EG", "en-AU", "en-GB", "en-CA", "en-NZ", "en-IE", "en-ZA", "en-JM", 
		"en-BZ", "en-TT", "et", "fo", "fa", "fi", "fr", "fr-BE", "fr-CA", "fr-CH", "fr-LU", 
		"gd", "gd-IE", "de", "de-CH", "de-AT", "de-LU", "de-LI", "el", "he", "hi", "hu", 
		"is", "id", "it", "it-CH", "ja", "ko", "lv", "lt", "mk", "mt", "no", "pl", 
		"pt-BR", "pt", "rm", "ro", "ro-MO", "ru", "ru-MI", "sz", "sr", "sk", "sl", "sb", 
		"es", "es-AR", "es-GT", "es-CR", "es-PA", "es-DO", "es-MX", "es-VE", "es-CO", 
		"es-PE", "es-EC", "es-CL", "es-UY", "es-PY", "es-BO", "es-SV", "es-HN", "es-NI", 
		"es-PR", "sx", "sv", "sv-FI", "th", "ts", "tn", "tr", "uk", "ur", "ve", "vi", "xh", 
		"ji", "zu"]; 
	*/
function getLocale(lang) {
	lang = lang.toLowerCase()
	switch (lang) {
		case 'en':
			return 'en'
		case 'zh':
			return 'zh'
		case 'fr':
			return 'fr'
		case 'zh-cn':
			return 'zh'
		case 'es':
			return 'es'
		case 'ru':
			return 'ru'
		case 'ru-MI':
			return 'ru'
		default:
			return 'en'
	}
}

const isPlainObject = (obj) => {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

export function fallback() {
	const args = Array.from(arguments)
	if (args.length < 2) return args[0]
	let result = args[0]
	args.shift()
	args.forEach((item) => {
		if (isPlainObject(item)) {
			if (!isPlainObject(result)) result = {}
			for (let key in item) {
				if (result[key] && isPlainObject(item[key])) {
					result[key] = fallback(result[key], item[key])
				} else {
					result[key] = item[key]
				}
			}
		} else if (item instanceof Array) {
			if (!(result instanceof Array)) result = []
			item.forEach((arrItem, arrIndex) => {
				if (isPlainObject(arrItem)) {
					result[arrIndex] = fallback(result[arrIndex])
				} else {
					result[arrIndex] = arrItem
				}
			})
		}
	})
	return result
}
