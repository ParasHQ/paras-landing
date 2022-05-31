import React, { useEffect } from 'react'

const t = () => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res(console.log('promiseee'))
		}, 500)
	})
}

const u = () => {
	setTimeout(() => {
		console.log('promise')
	}, 500)
}

const Coba = () => {
	useEffect(() => {
		;(async () => {
			t()
			console.log('zzz')
		})()
	}, [])
	return <div>Coba</div>
}

export default Coba
