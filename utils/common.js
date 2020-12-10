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

export const prettyTruncate = (str = '', len = 8) => {
	if (str.length > len) {
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

export const parseImgUrl = (url) => {
	if (!url) {
		return ''
	}
	const [protocol, path] = url.split('://')
	if (protocol === 'ipfs') {
		return `https://ipfs-gateway.paras.id/ipfs/${path}`
	}
	return url
}
