import axios from 'axios'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import ActivityDetail, { descriptionMaker } from 'components/Activity/ActivityDetail'
import Error from '../404'
import { parseImgUrl } from 'utils/common'
import { useState } from 'react'
import useStore from 'lib/store'
import Modal from 'components/Modal'
import CopyLink from 'components/Common/CopyLink'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import { useIntl } from 'hooks/useIntl'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import TokenDetailModal from 'components/Token/TokenDetailModal'

const ActivityDetailPage = ({ errorCode, activity, token }) => {
	const { localToken, localTradedToken } = useStore()
	const [activityDetailIdx, setActivityDetailIdx] = useState(-1)
	const [showModalShare, setShowModalShare] = useState(null)
	const [isCopiedShare, setIsCopiedShare] = useState(false)
	const shareLink = `${process.env.BASE_URL}/activity/${activity._id}`
	const { localeLn } = useIntl()

	const handleAfterCopyShare = () => {
		setIsCopiedShare(true)

		setTimeout(() => {
			setShowModalShare(false)
			setIsCopiedShare(false)
		}, 1500)
	}

	if (errorCode) {
		return <Error />
	}

	const headMeta = {
		title: 'Activity — Paras',
		description: descriptionMaker(activity, token),
		image: `${parseImgUrl(token.metadata.media, null, { isMediaCdn: token.isMediaCdn })}`,
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
				<title>{headMeta.title}</title>
				<meta name="description" content={headMeta.description} />

				<meta name="twitter:title" content={headMeta.title} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta name="twitter:description" content={headMeta.description} />
				<meta name="twitter:image" content={headMeta.image} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta property="og:image" content={headMeta.image} />
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto py-12">
				<div className="px-4 max-w-2xl mx-auto">
					<ActivityDetail
						activity={activity}
						token={token}
						setShowModalShare={setShowModalShare}
						setShowDetailIndex={setActivityDetailIdx}
					/>
				</div>
			</div>
			<Footer />
			{showModalShare === 'options' && (
				<Modal close={() => setShowModalShare('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md text-black">
						<CopyLink link={shareLink} afterCopy={handleAfterCopyShare}>
							<div className="py-2 cursor-pointer flex items-center">
								<svg
									className="rounded-md"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect width="24" height="24" fill="#11111F" />
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12.7147 14.4874L13.7399 15.5126L11.6894 17.5631C10.2738 18.9787 7.97871 18.9787 6.56313 17.5631C5.14755 16.1476 5.14755 13.8524 6.56313 12.4369L8.61364 10.3864L9.63889 11.4116L7.58839 13.4621C6.73904 14.3115 6.73904 15.6885 7.58839 16.5379C8.43773 17.3872 9.8148 17.3872 10.6641 16.5379L12.7147 14.4874ZM11.6894 9.36136L10.6641 8.3361L12.7146 6.2856C14.1302 4.87002 16.4253 4.87002 17.8409 6.2856C19.2565 7.70118 19.2565 9.99628 17.8409 11.4119L15.7904 13.4624L14.7651 12.4371L16.8156 10.3866C17.665 9.53726 17.665 8.1602 16.8156 7.31085C15.9663 6.4615 14.5892 6.4615 13.7399 7.31085L11.6894 9.36136ZM9.12499 13.9751L10.1502 15.0004L15.2765 9.87409L14.2513 8.84883L9.12499 13.9751Z"
										fill="white"
									/>
								</svg>
								<p className="pl-2">{isCopiedShare ? `Copied` : `Copy Link`}</p>
							</div>
						</CopyLink>
						<div className="py-2 cursor-pointer">
							<TwitterShareButton
								title={`${descriptionMaker(
									activity,
									localToken,
									localTradedToken
								)} via @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
								url={shareLink}
								className="flex items-center w-full"
							>
								<TwitterIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></TwitterIcon>
								<p className="pl-2">{localeLn('Twitter')}</p>
							</TwitterShareButton>
						</div>
						<div className="py-2 cursor-pointer">
							<FacebookShareButton url={shareLink} className="flex items-center w-full">
								<FacebookIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></FacebookIcon>
								<p className="pl-2">{localeLn('Facebook')}</p>
							</FacebookShareButton>
						</div>
					</div>
				</Modal>
			)}
			<TokenSeriesDetailModal tokens={[localToken]} />
			<TokenDetailModal tokens={[localToken]} />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const activityResp = await axios.get(`${process.env.V2_API_URL}/activities`, {
		params: {
			_id: params.id,
		},
	})

	const activity = (await activityResp.data?.data?.results[0]) || null

	if (!activity) {
		return {
			props: {
				errorCode: 404,
			},
		}
	}

	const query = activity.token_id
		? {
				url: `${process.env.V2_API_URL}/token`,
				params: {
					contract_id: activity.contract_id,
					token_id: activity.token_id,
				},
		  }
		: {
				url: `${process.env.V2_API_URL}/token-series`,
				params: {
					contract_id: activity.contract_id,
					token_series_id: activity.token_series_id,
				},
		  }

	const tokenResp = await axios(query.url, {
		params: query.params,
	})

	const token = (await tokenResp.data.data.results[0]) || null

	const errorCode = activity && token ? false : 404

	return { props: { errorCode, activity, token } }
}

export default ActivityDetailPage
