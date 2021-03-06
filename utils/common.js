import CID from 'cids'
import Compressor from 'compressorjs'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

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
	if (str.length > len) {
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

	return new Promise((resolve, reject) => {
		temporaryFileReader.onload = () => {
			resolve(temporaryFileReader.result)
		}
		temporaryFileReader.readAsDataURL(file)
	})
}

export const readFileDimension = (file) => {
	const temporaryFileReader = new FileReader()

	return new Promise((resolve, reject) => {
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

export const parseImgUrl = (url, defaultValue = '', opts = {}) => {
	if (!url) {
		return defaultValue
	}
	const [protocol, path] = url.split('://')
	if (protocol === 'ipfs') {
		if (opts.useOriginal || process.env.APP_ENV !== 'production') {
			const cid = new CID(path)
			if (cid.version === 0) {
				return `https://ipfs-gateway.paras.id/ipfs/${path}`
			} else {
				return `https://ipfs.fleek.co/ipfs/${path}`
			}
		}

		let transformationList = []
		if (opts.width) {
			transformationList.push(`tr:w-${opts.width}`)
		} else {
			transformationList.push('tr:w-0.8')
		}
		return `https://cdn.paras.id/${transformationList.join(',')}/${path}`
	}
	return url
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
	return new Promise(async (resolve, reject) => {
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

export const parseSortQuery = (sort) => {
	if (!sort || sort === 'marketupdate') {
		return 'updatedAt_-1'
	} else if (sort === 'marketupdateasc') {
		return 'updatedAt_1'
	} else if (sort === 'cardcreate') {
		return 'createdAt_-1'
	} else if (sort === 'cardcreateasc') {
		return 'createdAt_1'
	} else if (sort === 'pricedesc') {
		return 'minPriceDecimal_-1'
	} else if (sort === 'priceasc') {
		return 'minPriceDecimal_1'
	}
}
