import CID from 'cids'
import Compressor from 'compressorjs'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import crypto from 'crypto'
import sanitize from 'sanitize-html'

TimeAgo.addLocale(en)
export const timeAgo = new TimeAgo('en-US')

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

export const parseDate = (ts) => {
	let dateObj = new Date(ts)
	let month = monthNames[dateObj.getMonth()].slice(0, 3)
	let day = String(dateObj.getDate()).padStart(2, '0')
	let year = dateObj.getFullYear()
	return `${day} ${month} ${year}`
}

export const prettyBalance = (balance, decimals = 18, len = 8) => {
	if (!balance) {
		return '0'
	}
	const diff = balance.toString().length - decimals
	const fixedPoint = Math.max(2, len - Math.max(diff, 0))
	const fixedBalance = (balance / 10 ** decimals).toFixed(fixedPoint)
	const finalBalance = parseFloat(fixedBalance).toString()
	const [head, tail] = finalBalance.split('.')
	if (head == 0) {
		if (tail) {
			return `${head}.${tail.substring(0, len - 1)}`
		}
		return `${head}`
	}
	const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return tail ? `${formattedHead}.${tail}` : formattedHead
}

export const prettyTruncate = (str = '', len = 8, type) => {
	if (str && str.length > len) {
		if (type === 'address') {
			const front = Math.ceil(len / 2)
			const back = str.length - (len - front)
			return `${str.slice(0, front)}...${str.slice(back)}`
		}
		return `${str.slice(0, len)}...`
	}
	return str
}

export const readFileAsUrl = (file) => {
	const temporaryFileReader = new FileReader()

	return new Promise((resolve) => {
		temporaryFileReader.onload = () => {
			resolve(temporaryFileReader.result)
		}
		temporaryFileReader.readAsDataURL(file)
	})
}

export const readFileDimension = (file) => {
	const temporaryFileReader = new FileReader()

	return new Promise((resolve) => {
		temporaryFileReader.onload = () => {
			const img = new Image()

			img.onload = () => {
				resolve({
					width: img.width,
					height: img.height,
				})
			}

			img.src = temporaryFileReader.result
		}
		temporaryFileReader.readAsDataURL(file)
	})
}

export const parseImgUrl = (imgUrl, defaultValue = '', opts = {}) => {
	if (!imgUrl) {
		return defaultValue
	}
	let url = imgUrl.includes('://') ? imgUrl : `ipfs://${imgUrl}`
	let schema = url.split('://')[0]
	let transformationList = []
	if (opts.width) {
		transformationList.push(`w=${opts.width}`)
		!opts.seeDetails && transformationList.push(`auto=format,compress`)
	} else {
		transformationList.push('w=800')
		!opts.seeDetails && transformationList.push(`auto=format,compress`)
	}
	if (schema === 'ipfs') {
		let parts = url.split('/')
		let hash = parts[2]
		let path = parts.length > 3 ? `/${parts.slice(3).join('/')}` : ''
		let cid
		try {
			cid = new CID(hash)
		} catch (e) {
			console.error(`Unable to parse CID: ${hash}`, e)
			return imgUrl
		}

		if (opts.useOriginal || process.env.APP_ENV !== 'production') {
			if (cid.version === 0) {
				return `https://ipfs-gateway.paras.id/ipfs/${cid}${path}`
			} else {
				return `https://ipfs.fleek.co/ipfs/${cid}${path}`
			}
		}
		return `https://paras-cdn.imgix.net/${cid}${path}?${transformationList.join('&')}`
	} else if (opts.isMediaCdn) {
		const sha1Url = sha1(imgUrl)
		return `https://paras-cdn.imgix.net/${sha1Url}?${transformationList.join('&')}`
	}
	return imgUrl
}

export const dataURLtoFile = (dataurl, filename) => {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}

	return new File([u8arr], filename, { type: mime })
}

export const compressImg = (file) => {
	return new Promise((resolve, reject) => {
		let _file = file
		const quality = 0.8
		new Compressor(_file, {
			quality: quality,
			maxWidth: 1080,
			maxHeight: 1080,
			convertSize: Infinity,
			success: resolve,
			error: reject,
		})
	})
}

export const checkUrl = (str) => {
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$',
		'i'
	)
	return !!pattern.test(str)
}

export const checkSocialMediaUrl = (str) => {
	var pattern = new RegExp(/(^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+\/)|(\/)/)
	return !!pattern.test(str)
}

export const checkTokenUrl = (str) => {
	var pattern = new RegExp(
		/^((https?|ftp|smtp):\/\/)?(www\.)?(paras\.id|localhost:\d+|marketplace-v2-testnet\.paras\.id|testnet\.paras\.id)\/token\/([a-z0-9\-#_]+\.?)+::[0-9A-z\-#_]+(\/[0-9A-z\-#_]+)?/
	)
	return !!pattern.test(str)
}

export const parseSortQuery = (sort, defaultMinPrice = false) => {
	if (!sort) {
		return defaultMinPrice ? 'lowest_price::1' : 'updated_at::-1'
	} else if (sort === 'marketupdate') {
		return 'updated_at::-1'
	} else if (sort === 'marketupdateasc') {
		return 'updated_at::1'
	} else if (sort === 'cardcreate') {
		return '_id::-1'
	} else if (sort === 'cardcreateasc') {
		return '_id::1'
	} else if (sort === 'pricedesc') {
		return 'lowest_price::-1'
	} else if (sort === 'priceasc') {
		return 'lowest_price::1'
	} else if (sort === 'scoredesc') {
		return 'metadata.score::-1'
	} else if (sort === 'urgentAuction') {
		return 'ended_at::1'
	}
}

export const parseSortTokenQuery = (sort) => {
	if (!sort || sort === 'cardcreate') {
		return '_id::-1'
	} else if (sort === 'cardcreateasc') {
		return '_id::1'
	} else if (sort === 'pricedesc') {
		return 'price::-1'
	} else if (sort === 'priceasc') {
		return 'price::1'
	} else if (sort === 'scoredesc') {
		return 'metadata.score::-1'
	} else if (sort === 'urgentAuction') {
		return 'ended_at::1'
	} else {
		return '_id::-1'
	}
}

export const parseGetTokenIdfromUrl = (url) => {
	const pathname = new URL(url).pathname.split('/')
	return {
		token_series_id: pathname[2],
		token_id: pathname[3],
	}
}

export const parseGetCollectionIdfromUrl = (url) => {
	const pathname = new URL(url).pathname.split('/')
	return {
		collection_id: pathname[2],
	}
}

export const capitalize = (words) => {
	return words[0].toUpperCase() + words.slice(1)
}

export default function sha1(data, encoding) {
	return crypto
		.createHash('sha1')
		.update(data)
		.digest(encoding || 'hex')
}

export const decodeBase64 = (b64text) => {
	return new TextDecoder().decode(Buffer.from(b64text, 'base64'))
}

export const isChromeBrowser =
	typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') !== -1

export const setDataLocalStorage = (key, value, setState = () => {}) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(key, value)
		setState(window.localStorage.getItem(key))
	}
}

export const getRandomInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}

export const abbrNum = (number, decPlaces) => {
	decPlaces = Math.pow(10, decPlaces)
	var abbrev = ['k', 'm', 'b', 't']

	for (var i = abbrev.length - 1; i >= 0; i--) {
		var size = Math.pow(10, (i + 1) * 3)
		if (size <= number) {
			number = Math.round((number * decPlaces) / size) / decPlaces
			if (number == 1000 && i < abbrev.length - 1) {
				number = 1
				i++
			}
			number += abbrev[i]
			break
		}
	}

	return number
}

export const isEmptyObject = (obj) => {
	return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
}

export const sanitizeHTML = (content) =>
	sanitize(content, {
		allowedTags: [
			'p',
			's',
			'b',
			'a',
			'span',
			'hr',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'table',
			'col',
			'tbody',
			'tr',
			'td',
			'colgroup',
			'code',
			'img',
			'iframe',
		],
		allowedAttributes: {
			p: ['style'],
			a: ['title', 'href', 'target', 'rel'],
			span: ['style'],
			table: ['style'],
			img: ['src', 'href', 'width', 'height', 'target'],
			iframe: ['src', 'href', 'title', 'width', 'height', 'target', 'allowfullscreen'],
			col: ['style'],
			tr: ['style'],
			td: ['style'],
		},
	})
