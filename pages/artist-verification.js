import axios from 'axios'
import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import { useToast } from 'hooks/useToast'
import { checkSocialMediaUrl } from 'utils/common'
import { useRouter } from 'next/router'
import { sentryCaptureException } from 'lib/sentry'
import WalletHelper from 'lib/WalletHelper'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'

import { useIntl } from 'hooks/useIntl'
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
const Verify = () => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const store = useStore()
	const toast = useToast()
	const recaptchaRef = useRef()

	const [profile, setProfile] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDisable, setIsDisable] = useState(false)
	const [totalQuota, setTotalQuota] = useState(0)
	const [totalCurrent, setTotalCurrent] = useState(0)
	const [isQuotaAvail, setIsQuotaAvail] = useState(true)
	const [formState, setFormState] = useState('loading')
	const [verifyStatus, setVerifyStatus] = useState({})
	const [scheduleTimestamp, setScheduleTimestamp] = useState('')
	const {
		formState: { errors },
		register,
		handleSubmit,
		setError,
		setValue,
	} = useForm()

	useEffect(() => {
		if (router.isReady && store.currentUser) {
			setProfile(`${window.location.origin}/${store.currentUser}`)
			checkStatusVerification()
			checkQuota()
			checkFinishSchedule()
		} else if (store.initialized && store.currentUser === null) {
			router.push('/login')
		}
	}, [store])

	useEffect(() => {
		register({ name: 'captchaToken' }, { required: true })
	})

	const checkQuota = async () => {
		try {
			const resp = await axios.get(`${process.env.V2_API_URL}/verifications/check-quota`, {
				headers: {
					authorization: await WalletHelper.authToken(),
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

	const checkFinishSchedule = async () => {
		try {
			const resp = await axios.get(`${process.env.V2_API_URL}/verifications/scheduled-finish`, {
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			})
			const data = resp.data.data
			setScheduleTimestamp(data.timestamp)
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

	const checkStatusVerification = async () => {
		try {
			const resp = await axios.get(
				`${process.env.V2_API_URL}/verifications?accountId=${store.currentUser}`,
				{
					headers: {
						authorization: await WalletHelper.authToken(),
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

	const _submit = async (data) => {
		setIsSubmitting(true)
		setIsDisable(true)

		if (data.instagram && checkSocialMediaUrl(data.instagram)) {
			setError('instagram', { type: 'invalid-url' }, { shouldFocus: true })
			setIsSubmitting(false)
			setIsDisable(false)
			return
		}

		if (data.twitter && checkSocialMediaUrl(data.twitter)) {
			setError('twitter', { type: 'invalid-url' }, { shouldFocus: true })
			setIsSubmitting(false)
			setIsDisable(false)
			return
		}

		const dataPost = {
			name: data.name,
			email: data.email,
			telegram_discord: data.telegramDiscord,
			paras_profile: profile,
			instagram: data.instagram,
			twitter: data.twitter,
			captcha_token: data.captchaToken,
		}

		try {
			await axios.post(`${process.env.V2_API_URL}/verifications`, dataPost, {
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			})
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
		} catch (err) {
			sentryCaptureException(err)
			const errMsg = err.response.data.message || 'SomethingWentWrong'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{localeLn(errMsg)}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			setIsDisable(false)
		}
	}

	const _goToProfile = async (e) => {
		e.preventDefault()
		router.push(`/${store.currentUser}`)
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
				<form onSubmit={handleSubmit(_submit)}>
					<div className="mt-6">
						<label className="mb-1 block text-lg text-gray-50">{localeLn('Email')}</label>
						<input
							type="email"
							name="email"
							className="focus:border-gray-100"
							placeholder="Email"
							ref={register({
								required: true,
							})}
						/>
						<div className="mt-2 text-sm text-red-500">
							{errors.email?.type === 'required' && 'Email is required'}
						</div>
					</div>
					<div className="mt-6">
						<label className="mb-1 block text-lg text-gray-50">{localeLn('Name')}</label>
						<input
							type="text"
							name="name"
							className="focus:border-gray-100"
							placeholder="Name"
							ref={register({
								required: true,
							})}
						/>
						<div className="mt-2 text-sm text-red-500">
							{errors.name?.type === 'required' && 'Name is required'}
						</div>
					</div>
					<div className="mt-6">
						<label className="mb-1 block text-lg text-gray-50">
							{localeLn('Telegram/Discord Account')}
						</label>
						<input
							type="text"
							name="telegramDiscord"
							className="focus:border-gray-100"
							placeholder="Telegram/Discord Account"
							ref={register({
								required: true,
							})}
						/>
						<div className="mt-2 text-sm text-red-500">
							{errors.telegramDiscord?.type === 'required' &&
								'Telegram/Discord Account is required'}
						</div>
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
							className="focus:border-gray-100"
							placeholder="Instagram"
							ref={register({
								required: true,
							})}
						/>
						<div className="mt-2 text-sm text-red-500">
							{errors.instagram?.type === 'required' && 'Instagram is required'}
							{errors.instagram?.type === 'invalid-url' &&
								localeLn('Please enter only your instagram username')}
						</div>
					</div>
					<div className="mt-6">
						<label className="mb-1 block text-lg text-gray-50">{localeLn('Twitter')}</label>
						<input
							type="text"
							name="twitter"
							className="focus:border-gray-100"
							placeholder="Twitter"
							ref={register({
								required: true,
							})}
						/>
						<div className="mt-2 text-sm text-red-500">
							{errors.twitter?.type === 'required' && 'Twitter is required'}
							{errors.twitter?.type === 'invalid-url' &&
								localeLn('Please enter only your twitter username')}
						</div>
					</div>
					<div className="mt-6">
						<ReCAPTCHA
							size="normal"
							ref={recaptchaRef}
							sitekey={process.env.RECAPTCHA_SITE_KEY}
							onChange={(token) => setValue('captchaToken', token)}
						/>
						<div className="mt-2 text-sm text-red-500">
							{errors.captchaToken?.type === 'required' && 'Captcha is required'}
						</div>
					</div>
					{!isQuotaAvail && (
						<p className="mt-6 block text-lg text-red-600">
							<strong>Quota:</strong> {totalCurrent} / {totalQuota} Quota full. Please wait for the
							next cycle {scheduleTimestamp !== '' && `at ${scheduleTimestamp} UTC+7`}
						</p>
					)}
					{isQuotaAvail && (
						<p className="mt-6 block text-lg text-gray-50">
							<strong>Quota:</strong> {totalCurrent} / {totalQuota}
						</p>
					)}
					<div className="mt-6">
						<button
							disabled={isDisable}
							className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							type="submit"
						>
							{!isSubmitting ? 'Submit' : 'Submiting...'}
						</button>
					</div>
				</form>
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
							onClick={_goToProfile}
						>
							Profile
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
		const urlShare = `${process.env.BASE_URL}/${store.currentUser}/creation`

		return (
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<h1 className="text-4xl font-bold text-gray-100 text-center">
					{localeLn('VerificationStatus')}
				</h1>
				<div className="mt-6 text-justify text-l text-gray-300 mb-12">
					<div className=" text-center ">
						<h3 className="text-2xl font-bold text-green-500 mt-20">
							{localeLn('YouAreVerified')}
						</h3>
						<p className="mt-3">{verifiedDate && `${localeLn('Since')} ${verifiedDate}`}</p>
						<p className="mt-16 mb-3">{localeLn('ShareNow')}</p>
						<div className="flex flex-row items-center justify-center gap-3">
							<TwitterShareButton
								title={`Hey I'm verified creator on Paras. Check out my creation only on @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
								url={urlShare}
								className="flex text-white"
							>
								<TwitterIcon size={24} round />
								<p className="ml-2">Twitter</p>
							</TwitterShareButton>
							<FacebookShareButton url={urlShare} className="flex text-white">
								<FacebookIcon size={24} round />
								<p className="ml-2">Facebook</p>
							</FacebookShareButton>
							<TelegramShareButton url={urlShare} className="flex text-white">
								<TelegramIcon size={24} round />
								<p className="ml-2">Telegram</p>
							</TelegramShareButton>
						</div>
					</div>
				</div>
				<center>
					<button
						className="w-6/12  outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
						onClick={_goToProfile}
					>
						Profile
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

				<meta
					name="twitter:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
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
				<meta
					property="og:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta
					property="og:site_name"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
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
