import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import cachios from 'cachios'

import Card from 'components/Card/Card'
import LinkToProfile from 'components/LinkToProfile'
import Modal from 'components/Modal'

import { parseImgUrl, prettyTruncate, timeAgo } from 'utils/common'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import { useRouter } from 'next/router'
import CopyLink from 'components/Common/CopyLink'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useRef } from 'react'

export const descriptionMaker = (activity, localToken, localTradedToken) => {
	const type = activity.type

	if (type === 'add_market_data' || type === 'update_market_data') {
		return `${activity.msg.params.owner_id} put on sale put on sale for ${formatNearAmount(
			activity.msg.params.price
		)} Ⓝ`
	}

	if (type === 'delete_market_data') {
		return `${activity.msg.params.owner_id} remove from sale`
	}

	if (type === 'nft_transfer' && activity.from === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		if (activity.price) {
			return `${activity.to} bought #${
				edition_id || activity.msg.params.token_id
			} for ${formatNearAmount(activity.price)} Ⓝ`
		}

		if (activity.to === activity.creator_id) {
			return `${activity.to} minted #${edition_id || activity.msg.params.token_id}`
		}

		return `${activity.creator_id} minted #${edition_id || activity.msg.params.token_id} ${
			activity.to
		}`
	}

	if (type === 'nft_transfer' && activity.to === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		return `${activity.from} burned #${edition_id || 1}`
	}

	if (type === 'nft_transfer' || type === 'resolve_purchase') {
		if (activity.price) {
			if (activity.is_offer) {
				return `${activity.from} ${'accepted offer from'} ${activity.to} for ${formatNearAmount(
					activity.msg.params.price
				)} Ⓝ`
			}
			return `${activity.to} bought from ${activity.from}`
		}
		return `${activity.from} transferred to ${activity.to}`
	}

	if (type === 'nft_create_series') {
		return `series created by ${activity.msg.params.creator_id}`
	}

	if (type === 'nft_set_series_price') {
		if (!activity.msg.params.price) {
			return `put the series to not for sale`
		}
		return `put the series on sale for ${formatNearAmount(activity.msg.params.price)} Ⓝ`
	}

	if (type === 'nft_set_series_non_mintable') {
		return `put the series to non-mintable`
	}

	if (type === 'nft_decrease_series_copies') {
		return `decrease the series copies to ${activity.msg.params.copies}`
	}

	if (type === 'add_offer') {
		return `${activity.from} 'added offer for' ${formatNearAmount(activity.msg.params.price)} Ⓝ}`
	}

	if (type === 'delete_offer') {
		return `${activity.from} 'removed offer' ${formatNearAmount(activity.msg.params.price)} Ⓝ`
	}

	if (type === 'add_trade' || type === 'delete_trade') {
		return `${activity.from} ${type.includes('add') ? `add` : `delete`} trade ${
			localToken?.metadata?.title
		} with ${localTradedToken?.metadata?.title}`
	}

	if (type === 'accept_trade') {
		return `${localToken?.metadata?.owner_id} accepted trade ${localToken?.metadata?.title} with ${localToken?.metadata?.title}`
	}

	return ``
}

const Activity = ({ activity, localTradedToken, localToken }) => {
	const { localeLn } = useIntl()
	const type = activity.type

	if (type === 'add_market_data' || type === 'update_market_data') {
		return (
			<p>
				<LinkToProfile
					className="text-gray-100 hover:border-gray-100"
					accountId={activity.msg.params.owner_id}
				/>
				<span>
					{' '}
					{localeLn('PutOnSaleFor')} {formatNearAmount(activity.msg.params.price)} Ⓝ
				</span>
			</p>
		)
	}

	if (type === 'delete_market_data') {
		return (
			<p>
				<LinkToProfile
					className="text-gray-100 hover:border-gray-100"
					accountId={activity.msg.params.owner_id}
				/>
				<span> {localeLn('RemoveFromSale')}</span>
			</p>
		)
	}

	if (type === 'nft_transfer' && activity.from === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		if (activity.price) {
			return (
				<p>
					<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
					<span>
						{' '}
						bought{' '}
						<span className="font-semibold">
							#{edition_id || activity.msg.params.token_id}
						</span> for{' '}
					</span>
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			)
		}

		return (
			<p>
				<span>
					minted{' '}
					<span className="font-semibold">#{edition_id || activity.msg.params.token_id}</span> by{' '}
				</span>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
			</p>
		)
	}

	if (type === 'nft_transfer' && activity.msg.is_staked) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		return (
			<p>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.from} />
				<span>
					{' '}
					staked{' '}
					<span className="font-semibold">#{edition_id || activity.msg.params.token_id}</span>
				</span>
				<span>
					{' '}
					to{' '}
					<Link href="https://stake.paras.id">
						<a className="border-b-2 border-transparent text-gray-100 hover:border-gray-100">
							<span className="font-semibold">{activity.msg.seed_title}</span>
						</a>
					</Link>
				</span>
			</p>
		)
	}

	if (type === 'nft_transfer' && activity.to === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		return (
			<p>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.from} />
				<span>
					{' '}
					burned{' '}
					<span className="font-semibold">#{edition_id || activity.msg.params.token_id}</span>
				</span>
			</p>
		)
	}

	if (type === 'nft_transfer' || type === 'resolve_purchase') {
		if (activity.price) {
			if (activity.is_offer) {
				return (
					<p>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.from}
						/>
						<span> {localeLn('accepted offer from')} </span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.to}
						/>{' '}
						<span>
							{' '}
							{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
						</span>
					</p>
				)
			}
			return (
				<p>
					<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
					<span> bought from </span>
					<LinkToProfile
						className="text-gray-100 hover:border-gray-100"
						accountId={activity.from}
					/>
					<span> {localeLn('for')} </span>
					{formatNearAmount(activity.msg.params.price) === '0'
						? 'free'
						: `${formatNearAmount(activity.msg.params.price)} Ⓝ`}
				</p>
			)
		}
		return (
			<p>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.from} />
				<span> transferred to </span>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
			</p>
		)
	}

	if (type === 'nft_create_series') {
		return (
			<p>
				<span>series created by </span>
				<LinkToProfile
					className="text-gray-100 hover:border-gray-100"
					accountId={activity.msg.params.creator_id}
				/>
			</p>
		)
	}

	if (type === 'nft_set_series_price') {
		if (!activity.msg.params.price) {
			return (
				<p>
					<span>put the series to not for sale</span>
				</p>
			)
		}
		return (
			<p>
				<span>put the series on sale for {formatNearAmount(activity.msg.params.price)} Ⓝ</span>
			</p>
		)
	}

	if (type === 'nft_set_series_non_mintable') {
		return (
			<p>
				<span> put the series to non-mintable </span>
			</p>
		)
	}

	if (type === 'nft_decrease_series_copies') {
		return (
			<p>
				<span> decrease the series copies to {activity.msg.params.copies} </span>
			</p>
		)
	}

	if (type === 'add_offer') {
		return (
			<p>
				<span>
					<LinkToProfile
						className="text-gray-100 hover:border-gray-100"
						accountId={activity.from}
					/>
				</span>
				<span> {localeLn('add offer for')}</span>
				<span> {formatNearAmount(activity.msg.params.price)} Ⓝ</span>
			</p>
		)
	}

	if (type === 'delete_offer') {
		return (
			<p>
				<span>
					<span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.from}
						/>
					</span>
					<span> {localeLn('removed offer')}</span>
				</span>
			</p>
		)
	}

	if (type === 'add_trade' || type === 'delete_trade') {
		return (
			<p>
				<span>
					<span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.msg.params.buyer_id}
						/>
					</span>
					<span>
						{` `}
						{type.includes(`add`) ? `add` : `delete`} trade{' '}
						<span className="font-bold">{localTradedToken?.metadata?.title}</span> with{' '}
						<span className="font-bold">{localToken?.metadata.title}</span>
					</span>
				</span>
			</p>
		)
	}

	if (type === 'accept_trade') {
		return (
			<p>
				<span>
					<span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={localTradedToken?.owner_id}
						/>
					</span>
					<span>
						{` `}
						accept trade <span className="font-bold">
							{localTradedToken?.metadata?.title}
						</span> with <span className="font-bold">{localToken?.metadata.title}</span>
					</span>
				</span>
			</p>
		)
	}

	return null
}

const ActivityDetail = ({ activity }) => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const [showModal, setShowModal] = useState(null)
	const [isCopied, setIsCopied] = useState(false)
	const [localToken, setLocalToken] = useState(null)
	const receiptRef = useRef(null)
	const receiptSmallRef = useRef(null)
	const [receiptWidth, setReceiptWidth] = useState(0)
	const [receiptSmallWidth, setReceiptSmallWidth] = useState(0)
	const MARGIN_RECEIPTID_DIV = 48
	const MARGIN_RECEIPTID_SMALL_DIV = 24

	const shareLink = `${process.env.BASE_URL}/activity/${activity._id}`
	const [isFlipped, setIsFlipped] = useState(true)
	const [localTradedToken, setLocalTradedToken] = useState(null)
	const topCardPositionStyle = `top-0 left-1/4 md:left-0 lg:left-5 z-30`
	const bottomCardPositionStyle = `top-3 left-24 md:left-1 lg:left-8 z-20`
	const isTradeActivity = activity?.type?.includes('trade')

	const fetchTradeToken = async () => {
		const params = {
			token_id: activity.msg.params.buyer_token_id,
			contract_id: activity.msg.params.buyer_nft_contract_id,
			__limit: 1,
		}
		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
			ttl: 30,
		})
		setLocalTradedToken(resp.data.data.results[0])
	}

	useEffect(() => {
		if (activity?.type?.includes('trade')) {
			fetchTradeToken()
		}
	}, [])

	useEffect(() => {
		if (activity) {
			fetchData()
		}
	}, [activity])

	useEffect(() => {
		setReceiptWidth(receiptRef.current.clientWidth + MARGIN_RECEIPTID_DIV)
		setReceiptSmallWidth(receiptSmallRef.current.clientWidth + MARGIN_RECEIPTID_SMALL_DIV)
	}, [])

	const fetchData = async () => {
		const url = activity.token_id
			? `${process.env.V2_API_URL}/token?token_id=${activity.token_id}&contract_id=${activity.contract_id}`
			: `${process.env.V2_API_URL}/token-series?token_series_id=${activity.token_series_id}&contract_id=${activity.contract_id}`

		const resp = await cachios.get(url, {
			ttl: 60,
		})

		setLocalToken(resp.data.data.results[0])
	}

	const handleAfterCopy = () => {
		setIsCopied(true)

		setTimeout(() => {
			setShowModal(false)
			setIsCopied(false)
		}, 1500)
	}

	if (activity.type === 'resolve_purchase_fail' || activity.type === 'notification_add_offer') {
		return null
	}

	return (
		<Fragment>
			<TokenSeriesDetailModal tokens={[localToken]} />
			<TokenDetailModal tokens={[localToken]} />
			{showModal === 'options' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
						<CopyLink link={shareLink} afterCopy={handleAfterCopy}>
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
								<p className="pl-2">{isCopied ? `Copied` : `Copy Link`}</p>
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
			<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 rounded-md max-w-2xl mx-auto">
				<div className={`w-full md:w-1/3 ${isTradeActivity && `relative h-60`}`}>
					{isTradeActivity && (
						<div
							className={`${`absolute w-6/12 md:w-40 cursor-pointer ${
								isFlipped
									? `transition-all ${topCardPositionStyle}`
									: `transition-all ${bottomCardPositionStyle}`
							}`}`}
							onClick={() => isTradeActivity && setIsFlipped(!isFlipped)}
						>
							<Card
								imgUrl={parseImgUrl(localTradedToken?.metadata.media, null, {
									width: `600`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
								})}
								imgBlur={localTradedToken?.metadata.blurhash}
								token={{
									title: localTradedToken?.metadata.title,
									edition_id: localTradedToken?.edition_id,
									collection:
										localTradedToken?.metadata.collection || localTradedToken?.contract_id,
									copies: localTradedToken?.metadata.copies,
									creatorId: localTradedToken?.metadata.creator_id || localTradedToken?.contract_id,
									is_creator: localTradedToken?.is_creator,
								}}
							/>
						</div>
					)}
					<div
						className={`${
							isTradeActivity
								? `absolute w-6/12 md:w-40 cursor-pointer ${
										!isFlipped
											? `transition-all ${topCardPositionStyle}`
											: `transition-all ${bottomCardPositionStyle}`
								  }`
								: `w-40 mx-auto`
						}`}
						onClick={() => isTradeActivity && setIsFlipped(!isFlipped)}
					>
						<Card
							imgUrl={parseImgUrl(localToken?.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
							})}
							imgBlur={localToken?.metadata.blurhash}
							token={{
								title: localToken?.metadata.title,
								edition_id: localToken?.edition_id,
								collection: localToken?.metadata.collection || localToken?.contract_id,
								copies: localToken?.metadata.copies,
								creatorId: localToken?.metadata.creator_id || localToken?.contract_id,
								is_creator: localToken?.is_creator,
							}}
						/>
					</div>
				</div>
				<div className="w-full max-h-full md:w-2/3 text-gray-100 pt-4 pl-0 md:pt-0 md:pl-4 flex flex-col justify-between">
					<div className="overflow-hidden h-4/5">
						<div className="flex items-center justify-between">
							<div className="w-10/12 overflow-hidden truncate">
								<Link
									href={{
										pathname: router.pathname,
										query: {
											...router.query,
											...(activity.token_id
												? { tokenId: localToken?.token_id }
												: { tokenSeriesId: localToken?.token_series_id }),
											contractId: localToken?.contract_id,
										},
									}}
									as={`/token/${localToken?.contract_id}::${localToken?.token_series_id}${
										activity.token_id ? `/${localToken?.token_id}` : ''
									}`}
									scroll={false}
									shallow
								>
									<a
										title={localToken?.metadata?.title}
										className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-100"
									>
										{isTradeActivity
											? localTradedToken?.metadata?.title
											: localToken?.metadata?.title}
									</a>
								</Link>
							</div>
							<div>
								<div
									onClick={() => setShowModal('options')}
									className="cursor-pointer w-8 h-8 rounded-full transition-all duration-200 hover:bg-dark-primary-4 flex items-center justify-center"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M12 2.79623V8.02302C5.45134 8.33141 2 11.7345 2 18V20.4142L3.70711 18.7071C5.95393 16.4603 8.69021 15.5189 12 15.8718V21.2038L22.5186 12L12 2.79623ZM14 10V7.20377L19.4814 12L14 16.7962V14.1529L13.1644 14.0136C9.74982 13.4445 6.74443 14.0145 4.20125 15.7165C4.94953 11.851 7.79936 10 13 10H14Z"
											fill="white"
										/>
									</svg>
								</div>
								{activity.transaction_hash && (
									<a
										href={`https:///explorer.${
											process.env.APP_ENV === 'production' ? `mainnet` : `testnet`
										}.near.org/transactions/${activity.transaction_hash}${
											activity.msg?.receipt_id && `#${activity.msg?.receipt_id}`
										}`}
										target={`_blank`}
									>
										<div className="w-8 h-8 rounded-full transition-all duration-200 hover:bg-dark-primary-4 flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-receipt"
												width={18}
												height={18}
												viewBox="0 0 24 24"
												strokeWidth="2"
												stroke="#fff"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2m4 -14h6m-6 4h6m-2 4h2" />
											</svg>
										</div>
									</a>
								)}
							</div>
						</div>
						<p className="opacity-75 truncate">
							{localToken?.metadata?.collection_id
								? isTradeActivity
									? localTradedToken?.metadata?.collection
									: localToken?.metadata.collection
								: isTradeActivity
								? localTradedToken?.metadata?.contract_id
								: localToken?.contract_id}
						</p>
						<div className="my-4">
							<Activity
								activity={activity}
								localToken={localToken}
								localTradedToken={localTradedToken}
							/>
							<p className="mt-2 text-sm opacity-50">
								{timeAgo.format(new Date(activity.msg.datetime))}
							</p>
						</div>
					</div>
					{activity.msg?.receipt_id && (
						<>
							<div className="hidden lg:flex items-center h-1/5 relative">
								<div className="mr-2">
									<svg
										width={`${receiptWidth}px`}
										height="30px"
										viewBox="0 0 480 30"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
									>
										<title>Rectangle</title>
										<g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
											<path
												d="M476,1 C476.828427,1 477.578427,1.33578644 478.12132,1.87867966 C478.664214,2.42157288 479,3.17157288 479,4 L479,4 L479,9.19042644 C478.999718,9.93835491 478.723972,10.6290427 478.263093,11.158588 C477.802285,11.6880528 477.156399,12.0564164 476.415278,12.1598766 C474.780567,12.3888963 473.557489,12.6769797 472.740617,13.0064887 C472.217387,13.2175485 471.834429,13.4570552 471.573889,13.6993417 C471.136634,14.1059632 470.968269,14.5519236 470.968269,15 C470.968269,15.4354859 471.13118,15.8910783 471.572266,16.3275112 C471.838345,16.5907838 472.230505,16.8609019 472.764211,17.1175943 C473.631354,17.5346572 474.92966,17.9470288 476.664467,18.3403402 C477.347301,18.4953024 477.931053,18.8762182 478.344159,19.3934395 C478.757303,19.9107075 478.999772,20.564302 479,21.2642336 L479,21.2642336 L479,26 C479,26.8284271 478.664214,27.5784271 478.12132,28.1213203 C477.578427,28.6642136 476.828427,29 476,29 L476,29 L4,29 C3.17157288,29 2.42157288,28.6642136 1.87867966,28.1213203 C1.33578644,27.5784271 1,26.8284271 1,26 L1,26 L0.999999997,21.3845311 C0.999946319,20.6623475 1.2572016,19.991405 1.6919389,19.467827 C2.12668662,18.9442364 2.7389244,18.5680162 3.44867931,18.4353214 C5.4587111,18.059836 6.96369897,17.6508053 7.96837234,17.2221614 C8.57539168,16.9631765 9.02255754,16.6855171 9.32522624,16.4111967 C9.82948175,15.9541703 10.012912,15.4674435 10.012912,15 C10.012912,14.5190808 9.82348111,14.0407783 9.31933397,13.6134529 C9.02197872,13.3614086 8.58345824,13.115901 7.98649243,12.9041753 C7.02878718,12.5645064 5.5939988,12.2827531 3.67759919,12.0754097 C2.91616916,11.9931263 2.24688185,11.6306338 1.7678963,11.0972469 C1.28890469,10.5638532 1.00021938,9.85956149 1,9.09397558 L1,9.09397558 L1,4 C1,3.17157288 1.33578644,2.42157288 1.87867966,1.87867966 C2.42157288,1.33578644 3.17157288,1 4,1 L4,1 Z"
												id="Rectangle"
												stroke="#4e4e50"
												strokeWidth={1}
											/>
										</g>
									</svg>
								</div>
								<div
									className={`text-xs ml-6 mt-1 absolute left-0 text-white text-opacity-30`}
									ref={receiptRef}
								>
									{activity.msg?.receipt_id}
								</div>
							</div>
							<div className="flex lg:hidden items-center h-1/5 relative">
								<div className="mr-2">
									<svg
										width={`${receiptSmallWidth}px`}
										height="38px"
										viewBox="0 0 480 25"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
									>
										<title>Rectangle</title>
										<g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
											<path
												d="M476,1 C476.828427,1 477.578427,1.33578644 478.12132,1.87867966 C478.664214,2.42157288 479,3.17157288 479,4 L479,4 L479,9.19042644 C478.999718,9.93835491 478.723972,10.6290427 478.263093,11.158588 C477.802285,11.6880528 477.156399,12.0564164 476.415278,12.1598766 C474.780567,12.3888963 473.557489,12.6769797 472.740617,13.0064887 C472.217387,13.2175485 471.834429,13.4570552 471.573889,13.6993417 C471.136634,14.1059632 470.968269,14.5519236 470.968269,15 C470.968269,15.4354859 471.13118,15.8910783 471.572266,16.3275112 C471.838345,16.5907838 472.230505,16.8609019 472.764211,17.1175943 C473.631354,17.5346572 474.92966,17.9470288 476.664467,18.3403402 C477.347301,18.4953024 477.931053,18.8762182 478.344159,19.3934395 C478.757303,19.9107075 478.999772,20.564302 479,21.2642336 L479,21.2642336 L479,26 C479,26.8284271 478.664214,27.5784271 478.12132,28.1213203 C477.578427,28.6642136 476.828427,29 476,29 L476,29 L4,29 C3.17157288,29 2.42157288,28.6642136 1.87867966,28.1213203 C1.33578644,27.5784271 1,26.8284271 1,26 L1,26 L0.999999997,21.3845311 C0.999946319,20.6623475 1.2572016,19.991405 1.6919389,19.467827 C2.12668662,18.9442364 2.7389244,18.5680162 3.44867931,18.4353214 C5.4587111,18.059836 6.96369897,17.6508053 7.96837234,17.2221614 C8.57539168,16.9631765 9.02255754,16.6855171 9.32522624,16.4111967 C9.82948175,15.9541703 10.012912,15.4674435 10.012912,15 C10.012912,14.5190808 9.82348111,14.0407783 9.31933397,13.6134529 C9.02197872,13.3614086 8.58345824,13.115901 7.98649243,12.9041753 C7.02878718,12.5645064 5.5939988,12.2827531 3.67759919,12.0754097 C2.91616916,11.9931263 2.24688185,11.6306338 1.7678963,11.0972469 C1.28890469,10.5638532 1.00021938,9.85956149 1,9.09397558 L1,9.09397558 L1,4 C1,3.17157288 1.33578644,2.42157288 1.87867966,1.87867966 C2.42157288,1.33578644 3.17157288,1 4,1 L4,1 Z"
												id="Rectangle"
												stroke="#4e4e50"
												strokeWidth={1}
											/>
										</g>
									</svg>
								</div>
								<div
									className={`text-xs ml-3 mt-1 absolute left-0 text-white text-opacity-30`}
									ref={receiptSmallRef}
								>
									{prettyTruncate(activity.msg?.receipt_id, 35, 'address')}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</Fragment>
	)
}

export default ActivityDetail
