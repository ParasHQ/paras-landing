export const prettyBalance = (balance, decimals = 18, len = 8) => {
	const diff = balance.toString().length - decimals
	const fixedPoint = len - Math.max(diff, 0)
	const finalBalance = (balance / 10 ** decimals)
		.toFixed(fixedPoint)
		.toLocaleString()
	const [head, tail] = finalBalance.split('.')
	if (head == 0) {
		return `${head}.${tail.substring(0, len - 1)}`
	}
	const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return `${formattedHead}.${tail}`
}
