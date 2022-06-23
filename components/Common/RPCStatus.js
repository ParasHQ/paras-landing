import { getRPC } from 'config/near'
import { useEffect } from 'react'

const MAX_RELOAD_TIMES = 3
const RPC_LIST = getRPC(process.env.APP_ENV)

const RPCStatus = () => {
	useEffect(() => {
		Object.entries(RPC_LIST).forEach(([key, data]) => ping(data.url, key))
	}, [])

	return null
}

export default RPCStatus

export async function ping(url, key) {
	const start = new Date().getTime()
	const businessRequest = fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json; charset=UTF-8' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 'dontcare',
			method: 'gas_price',
			params: [null],
		}),
	})
	const timeoutPromise = new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(-1)
		}, 8000)
	})
	const responseTime = await Promise.race([businessRequest, timeoutPromise])
		.then(() => {
			const end = new Date().getTime()
			return end - start
		})
		.catch((result) => {
			if (result == -1) {
				// timeout
				return -1
			} else {
				// other exception
				const currentRpc = localStorage.getItem('choosenRPC') || 'defaultRpc'
				if (currentRpc != key) {
					return -1
				} else {
					const availableRpc = Object.keys(RPC_LIST).find((item) => {
						if (item != key) return item
					})
					let reloadedTimes = Number(localStorage.getItem('rpc_reload_number') || 0)
					setTimeout(() => {
						reloadedTimes = reloadedTimes + 1
						if (reloadedTimes > MAX_RELOAD_TIMES) {
							localStorage.setItem('choosenRPC', 'defaultRpc')
							localStorage.setItem('rpc_reload_number', '')
							return -1
						} else {
							localStorage.setItem('choosenRPC', availableRpc)
							window.location.reload()
							localStorage.setItem('rpc_reload_number', reloadedTimes.toString())
						}
					}, 1000)
				}
			}
		})
	return responseTime
}
