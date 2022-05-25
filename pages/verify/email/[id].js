import Axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import { sentryCaptureException } from 'lib/sentry'
import { useIntl } from 'hooks/useIntl'

const EmailVerification = () => {
	const [emailVerified, setEmailVerified] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [message, setMessage] = useState('')
	const router = useRouter()
	const { localeLn } = useIntl()
	useEffect(() => {
		if (router.query.id) {
			verifyEmail()
		}
	}, [router.query.id])

	const verifyEmail = async () => {
		try {
			await Axios.put(`${process.env.V2_API_URL}/credentials/mail/verify`, {
				token: router.query.id,
			})
			setEmailVerified(true)
			setIsLoading(false)
		} catch (error) {
			sentryCaptureException(error)
			setMessage(error.response.data.message)
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen relative bg-black">
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
				<title>{localeLn('Paras - NFT Marketplace for Digital Collectibles on NEAR')}</title>
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
			<div className="pt-48 py-32 text-center relative">
				{emailVerified && !isLoading && (
					<>
						<svg
							height="100"
							width="100"
							viewBox="0 0 512 512"
							className="m-auto mb-8"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0"
								fill="#1300BA"
							/>
							<path
								d="m385.75 201.75-138.667969 138.664062c-4.160156 4.160157-9.621093 6.253907-15.082031 6.253907s-10.921875-2.09375-15.082031-6.253907l-69.332031-69.332031c-8.34375-8.339843-8.34375-21.824219 0-30.164062 8.339843-8.34375 21.820312-8.34375 30.164062 0l54.25 54.25 123.585938-123.582031c8.339843-8.34375 21.820312-8.34375 30.164062 0 8.339844 8.339843 8.339844 21.820312 0 30.164062zm0 0"
								fill="#fafafa"
							/>
						</svg>
						<div className="text-2xl text-gray-100 font-bold">{localeLn('EmailIsVerified')}</div>
					</>
				)}
				{!emailVerified && !isLoading && (
					<>
						<svg
							height="100"
							width="100"
							viewBox="0 0 233 233"
							fill="none"
							className="m-auto mb-8"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="116.5" cy="116.5" r="116.5" fill="#FF0000" />
							<rect
								x="66.7523"
								y="56"
								width="155.914"
								height="16.6203"
								rx="8.31013"
								transform="rotate(45 66.7523 56)"
								fill="white"
							/>
							<rect
								x="179.239"
								y="67.7523"
								width="155.122"
								height="16.6202"
								rx="8.31012"
								transform="rotate(135 179.239 67.7523)"
								fill="white"
							/>
						</svg>
						<div className="text-2xl text-gray-100 font-bold">{localeLn('VerificationError')}</div>
						{message === 'Token expired' && (
							<div className="text-lg text-gray-100 mt-2">
								{localeLn('LinkVerificationExpired')}
							</div>
						)}
					</>
				)}
				<div className="mt-8">
					<Link href="/market">
						<a className="text-lg text-gray-100 border-b-2 border-transparent hover:border-gray-100 opacity-75">
							{localeLn('BackToMarket')}
						</a>
					</Link>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default EmailVerification
