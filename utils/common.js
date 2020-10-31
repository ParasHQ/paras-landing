import { FinalExecutionStatusBasic } from 'near-api-js/lib/providers'

export const prettyBalance = (balance, decimals = 18, len = 8) => {
	const diff = balance.toString().length - decimals
	const fixedPoint = len - Math.max(diff, 0)
	const fixedBalance = (balance / 10 ** decimals).toFixed(fixedPoint)
	console.log(fixedBalance)
	const finalBalance = parseFloat(fixedBalance).toLocaleString()
	console.log(FinalExecutionStatusBasic)
	const [head, tail] = finalBalance.split('.')
	if (head == 0) {
		return `${head}.${tail.substring(0, len - 1)}`
	}
	const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return tail ? `${formattedHead}.${tail}` : formattedHead
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
