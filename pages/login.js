import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import near from '../lib/near'
import Nav from '../components/Nav'
import useStore from '../store'

const LoginPage = () => {
	const store = useStore()
	const router = useRouter()

	useEffect(() => {
		if (store.currentUser) {
			router.replace('/')
		}
	}, [store.currentUser])

	const _signIn = async () => {
		const appTitle = 'Paras — Digital Art Cards Market'
		near.wallet.requestSignIn(near.config.contractName, appTitle)
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Nav />
			<div className="max-w-lg m-auto flex items-center justify-center h-full px-4 mt-12">
				<div className="w-full">
					<div className="mt-4">
						<h3 className="text-4xl text-white font-bold">
							Create and Collect
						</h3>
						<h3 className="text-2xl text-gray-300 font-semibold">
							Start your journey with digital art cards on blockchain
						</h3>
					</div>
					<div className="mt-4">
						<button
							onClick={() => _signIn()}
							className="outline-none h-12 w-full mt-4 rounded-md bg-transparent font-semibold px-4 py-2 bg-primary text-white "
						>
							Login with NEAR
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
