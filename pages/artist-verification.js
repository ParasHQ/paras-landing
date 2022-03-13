import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { useEffect } from 'react'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import { useToast } from 'hooks/useToast'
import near from 'lib/near'
import { checkSocialMediaUrl } from 'utils/common'
import { useRouter } from 'next/router'
import { sentryCaptureException } from 'lib/sentry'

import { useIntl } from 'hooks/useIntl'
const Verify = () => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const store = useStore()
	const toast = useToast()

	const [profile, setProfile] = useState('')
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [telegramDiscord, setTelegramDiscord] = useState('')
	const [instagram, setInstagram] = useState('')
	const [twitter, setTwitter] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDisable, setIsDisable] = useState(false)
	const [totalQuota, setTotalQuota] = useState(0)
	const [totalCurrent, setTotalCurrent] = useState(0)
	const [isQuotaAvail, setIsQuotaAvail] = useState(true)
	const [formState, setFormState] = useState('loading')
	const [verifyStatus, setVerifyStatus] = useState({})

	useEffect(() => {
		if (router.isReady && store.currentUser) {
			setProfile(`${window.location.origin}/${store.currentUser}`)
			checkStatusVerification()
			checkQuota()
		}
	}, [router.isReady, store.currentUser])

	const checkQuota = async () => {
		try {
			const resp = await axios.get(`${process.env.V2_API_URL}/verifications/check-quota`, {
				headers: {
					authorization: await near.authToken(),
				},
			})
			const data = resp.data.data
			setTotalCurrent(data.totalCurrent > data.totalQuota ? data.totalQuota : data.totalCurrent)
			setTotalQuota(data.totalQuota)

			const status = data.totalCurrent >= data.totalQuota ? false : true
			if (!status) {
				setIsDisable(true)
				setIsQuotaAvail(false)
			}
			return status
		} catch (err) {
			sentryCaptureException(err)
			const errMsg = 'SomethingWentWrong'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{localeLn(errMsg)}</div>,
				type: 'error',
				duration: 2500,
			})
			return false
		}
	}

	const checkStatusVerification = async () => {
		try {
			const resp = await axios.get(
				`${process.env.V2_API_URL}/verifications?accountId=${store.currentUser}`,
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			const data = resp.data.data.results
			if (data.length > 0) {
				setVerifyStatus(data)
				setFormState('status')
			} else if (store.userProfile.isCreator) {
				setFormState('verified')
			} else {
				setFormState('form')
			}
		} catch (err) {
			sentryCaptureException(err)
			const errMsg = 'SomethingWentWrong'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{localeLn(errMsg)}</div>,
				type: 'error',
				duration: 2500,
			})
		}
	}

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)
		setIsDisable(true)

		if (instagram && checkSocialMediaUrl(instagram)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('Please enter only your instagram username')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			setIsDisable(false)
			return
		}

		if (twitter && checkSocialMediaUrl(twitter)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('Please enter only your twitter username')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			setIsDisable(false)
			return
		}

		const dataPost = {
			name: name,
			email: email,
			telegram_discord: telegramDiscord,
			paras_profile: profile,
			instagram: instagram,
			twitter: twitter,
		}

		try {
			await axios.post(`${process.env.V2_API_URL}/verifications`, dataPost, {
				headers: {
					authorization: await near.authToken(),
				},
			})
		} catch (err) {
			sentryCaptureException(err)
			const errMsg = err.response.data.message || 'SomethingWentWrong'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{localeLn(errMsg)}</div>,
				type: 'error',
				duration: 2500,
			})
		}
		toast.show({
			text: (
				<div className="font-semibold text-center text-sm">
					{localeLn('success submit submission')}
				</div>
			),
			type: 'success',
			duration: 2500,
		})
		checkStatusVerification()
		setIsSubmitting(false)
		setIsDisable(false)
	}

	const _goToHome = async (e) => {
		e.preventDefault()
		window.location.replace('/')
	}

	const _renderLoading = () => {
		return (
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<div className="flex items-center justify-center h-64 text-gray-100">
					{localeLn('LoadingLoading')}
				</div>
			</div>
		)
	}

	const _renderForm = () => {
		return (
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<h1 className="text-4xl font-bold text-gray-100 text-center">
					{localeLn('ParasArtistVerification')}
				</h1>
				<div className="mt-6 text-justify text-l text-gray-300">
					<p>{localeLn('TextFormParagraph1')}</p>
					<br></br>
					<p>{localeLn('TextFormParagraph2')}</p>
					<br></br>

					<ol className="list-decimal ml-6">
						<li>{localeLn('Step1')}</li>
						<li>{localeLn('Step2')}</li>
						<li>{localeLn('Step3')}</li>
						<li>{localeLn('Step4')}</li>
						<li>{localeLn('Step5')}</li>
						<li>{localeLn('Step6')}</li>
					</ol>
					<br></br>
					<p>
						{localeLn(
							`It’s also extremely important to remember that becoming verified artist does not grant you instant success. It’s a method to introduce yourself to a bigger community of Paras.`
						)}
					</p>
				</div>
				<div className="mt-6">
					<label className="mb-1 block text-lg text-gray-50">{localeLn('Email')}</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="focus:border-gray-100"
						placeholder="Email"
					/>
				</div>
				<div className="mt-6">
					<label className="mb-1 block text-lg text-gray-50">{localeLn('Name')}</label>
					<input
						type="text"
						name="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="focus:border-gray-100"
						placeholder="Name"
					/>
				</div>
				<div className="mt-6">
					<label className="mb-1 block text-lg text-gray-50">
						{localeLn('Telegram/Discord Account')}
					</label>
					<input
						type="text"
						name="telegram-discord"
						value={telegramDiscord}
						onChange={(e) => setTelegramDiscord(e.target.value)}
						className="focus:border-gray-100"
						placeholder="Telegram/Discord Account"
					/>
				</div>
				<div className="mt-6">
					<label className="mb-1 block text-lg text-gray-50">{localeLn('Paras Profile')}</label>
					<input
						type="text"
						name="paras-profile"
						value={profile}
						disabled
						className="bg-gray-400"
						placeholder="Paras Profile"
					/>
				</div>
				<div className="mt-6">
					<label className="mb-1 block text-lg text-gray-50">{localeLn('Instagram')}</label>
					<input
						type="text"
						name="instagram"
						value={instagram}
						onChange={(e) => setInstagram(e.target.value)}
						className="focus:border-gray-100"
						placeholder="Instagram"
					/>
				</div>
				<div className="mt-6">
					<label className="mb-1 block text-lg text-gray-50">{localeLn('Twitter')}</label>
					<input
						type="text"
						name="twitter"
						value={twitter}
						onChange={(e) => setTwitter(e.target.value)}
						className="focus:border-gray-100"
						placeholder="Twitter"
					/>
				</div>
				{!isQuotaAvail && (
					<p className="mt-6 block text-lg text-red-600">
						<strong>Quota:</strong> {totalCurrent} / {totalQuota} Quota full. Please wait for the
						next cycle
					</p>
				)}
				<div className="mt-6">
					<button
						disabled={isDisable}
						className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
						onClick={_submit}
					>
						{!isSubmitting ? 'Submit' : 'Submiting...'}
					</button>
				</div>
			</div>
		)
	}

	const _renderCheckStat = () => {
		const dataStatus = verifyStatus[0]
		const submittedDate = dataStatus?.createdAt
			? new Date(dataStatus?.createdAt).toISOString().substring(0, 10)
			: ''
		const inReviewDate = dataStatus?.reviewedAt
			? new Date(dataStatus?.reviewedAt).toISOString().substring(0, 10)
			: ''
		const resultDate = dataStatus?.resultAt
			? new Date(dataStatus?.resultAt).toISOString().substring(0, 10)
			: ''

		return (
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<h1 className="text-4xl font-bold text-gray-100 text-center">
					{localeLn('VerificationStatus')}
				</h1>
				<div className="mt-6 text-justify text-l text-gray-300 mb-20">
					<p>{localeLn('TextStatusParagraph1')}</p>
					<br></br>
					<p>{localeLn('TextStatusParagraph2')}</p>
					{resultDate && dataStatus.status === 'reject' && (
						<div className=" text-center ">
							<h3 className="text-2xl font-bold text-red-500 mt-20">
								{localeLn('VerificationRequestRejected')}
							</h3>
							<p>{dataStatus.note}</p>
						</div>
					)}
					{resultDate && dataStatus.status === 'verified' && (
						<div className="text-center ">
							<h3 className="text-2xl font-bold text-green-500 mt-20">
								{localeLn('YouAreVerified')}
							</h3>
						</div>
					)}
				</div>
				<div className="p-5">
					<div className="mx-4 p-4">
						<div className="flex items-center">
							<div className="flex items-center text-white relative">
								<div className="absolute -ml-10 text-center mb-20 w-32 text-xs font-medium text-teal-600">
									<p className="text-sm text-gray-50">{submittedDate}</p>
									<br></br>
								</div>
								{submittedDate != '' ? (
									<div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600 bg-blue-700"></div>
								) : (
									<div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600  bg-gray-300"></div>
								)}
								<div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium text-teal-600">
									<p className="text-lg text-gray-50">{localeLn('Submitted')}</p>
									<p className="mt-2 text-md text-gray-50">{localeLn('SubmittedDesc')}</p>
								</div>
							</div>
							<div className="flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"></div>
							<div className="flex items-center text-white relative">
								<div className="absolute -ml-10 text-center mb-20 w-32 text-xs font-medium text-teal-600">
									<p className="text-sm text-gray-50">{inReviewDate}</p>
									<br></br>
								</div>
								{inReviewDate != '' ? (
									<div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600 bg-blue-700"></div>
								) : (
									<div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600  bg-gray-300"></div>
								)}
								<div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium text-teal-600">
									<p className="text-lg text-gray-50">{localeLn('InReview')}</p>
									<p className="mt-2 text-md text-gray-50">{localeLn('InReviewDesc')}</p>
								</div>
							</div>
							<div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
							<div className="flex items-center text-gray-500 relative">
								<div className="absolute -ml-10 text-center mb-20 w-32 text-xs font-medium text-teal-600">
									<p className="text-sm text-gray-50">{resultDate}</p>
									<br></br>
								</div>
								{resultDate != '' ? (
									<div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600 bg-blue-700"></div>
								) : (
									<div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600  bg-gray-300"></div>
								)}
								<div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium text-gray-500">
									<p className="text-lg text-gray-50">{localeLn('Result')}</p>
									<p className="mt-2 text-md text-gray-50">{localeLn('ResultDesc')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="p-5 mt-20">
					<center>
						<button
							className="w-6/12  outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							onClick={_goToHome}
						>
							Home
						</button>
					</center>
				</div>
			</div>
		)
	}

	const _renderVerified = () => {
		const verifiedDate = store.userProfile?.verifiedAt
			? new Date(store.userProfile?.verifiedAt).toISOString().substring(0, 10)
			: ''

		return (
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<h1 className="text-4xl font-bold text-gray-100 text-center">
					{localeLn('VerificationStatus')}
				</h1>
				<div className="mt-6 text-justify text-l text-gray-300 mb-20">
					<div className=" text-center ">
						<h3 className="text-2xl font-bold text-green-500 mt-20">
							{localeLn('YouAreVerified')}
						</h3>
						<p className="mt-3">
							{localeLn('Since')} {verifiedDate}
						</p>
					</div>
				</div>
				<center>
					<button
						className="w-6/12  outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
						onClick={_goToHome}
					>
						Home
					</button>
				</center>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{localeLn('ArtistVerification')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta name="twitter:title" content="Paras - NFT Marketplace for Digital Collectibles" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras - NFT Marketplace for Digital Collectibles" />
				<meta property="og:site_name" content="Paras - NFT Marketplace for Digital Collectibles" />
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			{formState === 'form' && _renderForm()}
			{formState === 'status' && _renderCheckStat()}
			{formState === 'verified' && _renderVerified()}
			{formState === 'loading' && _renderLoading()}
			<Footer />
		</div>
	)
}

export default Verify
