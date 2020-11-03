import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import Card from '../components/Card'
import Nav from '../components/Nav'

export default function Home() {
	const [email, setEmail] = useState('')
	const [formBtnText, setFormBtnText] = useState('NOTIFY ME')
	const [errMsg, setErrMsg] = useState('empty')

	useEffect(() => {
		if (errMsg != 'empty') {
			setErrMsg('empty')
		}
	}, [email])

	const _notifyMeSubmit = async (e) => {
		e.preventDefault()
		const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/
		if (!regex.test(email)) {
			setErrMsg('Invalid email address')
			return
		}
		setFormBtnText('SENDING...')
		const resp = await axios.post('/api/notifyMe', {
			email: email,
		})
		if (resp.data.success) {
			setFormBtnText('SUCCESS')
			setTimeout(() => {
				setEmail('')
			}, 2500)
		} else {
			setErrMsg('Email already subscribed')
			setFormBtnText('FAILED')
		}
		setTimeout(() => {
			if (formBtnText === 'SUCCESS') {
				setEmail('')
			}
			setFormBtnText('NOTIFY ME')
		}, 2500)
	}

	return (
		<div
			className="min-h-screen relative bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Paras — Digital Art Cards Market</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="relative max-w-5xl m-auto px-4 pb-24 md:px-12">
				<div className="flex flex-wrap">
					<div
						className="w-full md:w-1/3 mt-12 md:mt-24"
						style={{
							maxWidth: `14rem`,
						}}
					>
						<Card
							imgUrl={`/3.png`}
							imgWidth={640}
							imgHeight={890}
							token={{
								name: 'Art Card',
								collection: 'Genesis',
								description: 'Display purpose only',
								creatorId: 'paras',
								supply: 1,
								tokenId: 'Qmsadsds',
								createdAt: new Date().getTime(),
							}}
						/>
					</div>
					<div className="w-full md:w-2/3 mt-12 md:mt-24 pl-0 md:pl-12">
						<h1 className="text-gray-100 text-4xl max-w-lg font-bold">
							Create, Trade and Collect Digital Art Cards (DACs).
						</h1>
						<p className="text-gray-400 text-2xl mt-4">
							All-in-one social DACs marketplace for creators and collectors.
						</p>
						<form onSubmit={_notifyMeSubmit}>
							<div className="flex flex-wrap max-w-lg -mx-2 mt-8">
								<div className="px-2 w-full md:w-8/12">
									<input
										onChange={(e) => setEmail(e.target.value)}
										value={email}
										placeholder="Email address"
										className="h-12 w-full mt-4 border-2 px-2 py-2 rounded-md border-white outline-none"
									/>
								</div>
								<div className="px-2 w-full md:w-4/12">
									<button
										disabled={formBtnText == 'SENDING...'}
										className={`
											outline-none h-12 w-full mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2
											text-gray-100  border-white
											${formBtnText == 'SUCCESS' && 'text-green-500 border-green-500'}
											${formBtnText == 'FAILED' && ' text-red-500 border-red-500'}
											`}
									>
										{formBtnText}
									</button>
								</div>
							</div>
							<p
								className={`mt-2 text-red-500 
								${errMsg != 'empty' ? 'opacity-100' : 'opacity-0'}`}
							>
								{errMsg}
							</p>
						</form>
					</div>
				</div>
				<div className="flex flex-wrap -mx-4">
					<div className="w-full md:w-1/2 mt-24 px-4">
						<h2 className="text-gray-100 font-bold text-2xl text-gradient">
							For Collectors
						</h2>
						<p className="mt-4 text-gray-400">
							Discover beautiful art cards and collect them on a
							blockchain-based technology that prevents forgery and provides
							provable ownership.
						</p>
						<div className="mt-8 flex items-center">
							<a
								href="https://forms.gle/vqpu66p8y23ZnMjt7"
								target="_blank"
								className="flex text-gray-200 hover:text-gray-100 font-semibold border-b-2 cursor-pointer "
							>
								Join the Waitlist
								<svg
									width="12"
									height="12"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="ml-1"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.70421 9.70711L13.9971 3.41421V7H15.9971V0H8.9971V2H12.5829L6.28999 8.29289L7.70421 9.70711ZM15 14V10H13V14H2V3H6V1H2C0.89543 1 0 1.89543 0 3V14C0 15.1046 0.89543 16 2 16H13C14.1046 16 15 15.1046 15 14Z"
										fill="white"
									/>
								</svg>
							</a>
						</div>
					</div>
					<div className="w-full md:w-1/2 mt-24 px-4">
						<h2 className="text-gray-100 font-bold text-2xl text-gradient">
							For Artists
						</h2>
						<p className="mt-4 text-gray-400">
							Create your digital art cards and sell them on the marketplace in
							just a few clicks. Start earning with your digital creation.
						</p>
						<div className="mt-8 flex items-center">
							<a
								href="https://forms.gle/QsZHqa2MKXpjckj98"
								target="_blank"
								className="flex text-gray-200 hover:text-gray-100 font-semibold border-b-2 cursor-pointer "
							>
								Apply as an Artist
								<svg
									width="12"
									height="12"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="ml-1"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.70421 9.70711L13.9971 3.41421V7H15.9971V0H8.9971V2H12.5829L6.28999 8.29289L7.70421 9.70711ZM15 14V10H13V14H2V3H6V1H2C0.89543 1 0 1.89543 0 3V14C0 15.1046 0.89543 16 2 16H13C14.1046 16 15 15.1046 15 14Z"
										fill="white"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
