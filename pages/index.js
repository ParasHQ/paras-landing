import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import YouTube from 'react-youtube'

export default function Home() {
	const [email, setEmail] = useState('')
	const [formBtnText, setFormBtnText] = useState('NOTIFY ME')
	const [errMsg, setErrMsg] = useState('empty')
	const [showVideoModal, setShowVideoModal] = useState(false)

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
			{showVideoModal && (
				<Modal close={(_) => setShowVideoModal(false)}>
					<div className="max-w-3xl w-full mx-auto p-4 relative">
						<div className="absolute z-10 top-0 right-0">
							<div
								className="bg-gray-300 p-2 rounded-full cursor-pointer"
								onClick={(_) => setShowVideoModal(false)}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
										fill="black"
									/>
								</svg>
							</div>
						</div>
						<YouTube
							containerClassName="youtube-container"
							className="rounded-lg"
							videoId="keW4k5pF4MA"
							opts={{
								playerVars: {
									autoplay: 1,
								},
							}}
						/>
					</div>
				</Modal>
			)}
			<Nav />
			<div className="relative max-w-6xl m-auto px-4 pb-24 md:px-12">
				<div className="flex flex-wrap relative">
					<div className="w-full mt-12 text-center relative z-10">
						<h1 className="text-white text-3xl md:text-5xl max-w-2xl m-auto font-bold">
							Create, Trade and Collect Digital Art Cards (DACs).
						</h1>
						<p className="text-gray-400 text-2xl mt-4">
							All-in-one social DACs marketplace for creators and collectors.
						</p>
						<form className="max-w-lg m-auto" onSubmit={_notifyMeSubmit}>
							<div className="flex flex-wrap -mx-2 mt-8">
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
				<div className="mt-8 max-w-xl mx-auto">
					<div className="relative">
						<div className="absolute inset-0 flex items-center justify-center">
							<div
								className="p-2 rounded-full overflow-hidden cursor-pointer relative"
								onClick={(_) => setShowVideoModal(true)}
							>
								<div className="absolute z-0 inset-0 bg-gray-100 opacity-75"></div>
								<svg
									className="relative z-10"
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M5 20.9999V2.99993C5 2.20876 5.87525 1.73092 6.54076 2.15875L20.5408 11.1587C21.1531 11.5524 21.1531 12.4475 20.5408 12.8411L6.54076 21.8411C5.87525 22.2689 5 21.7911 5 20.9999Z"
										fill="rgba(0,0,0,0.8)"
									/>
								</svg>
							</div>
						</div>
						<img className="rounded-md overflow-hidden" src="/thumbnail.jpg" />
					</div>
				</div>
				<div className="max-w-4xl m-auto">
					<div className="flex flex-wrap -mx-4">
						<div className="w-full md:w-1/2 mt-16 px-4">
							<h2 className="text-white font-bold text-2xl text-gradient">
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
									className="flex text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer "
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
							<p className="mt-2 text-gray-500 text-xs italic">
								Get Genesis NFT on Launch
							</p>
						</div>
						<div className="w-full md:w-1/2 mt-16 px-4">
							<h2 className="text-white font-bold text-2xl text-gradient">
								For Artists
							</h2>
							<p className="mt-4 text-gray-400">
								Create your digital art cards and sell them on the marketplace
								in just a few clicks. Start earning with your digital creation.
							</p>
							<div className="mt-8 flex items-center">
								<a
									href="https://forms.gle/QsZHqa2MKXpjckj98"
									target="_blank"
									className="flex text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer "
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
							<p className="mt-2 text-gray-500 text-xs italic">
								Get Free Ⓝ When You Start
							</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
