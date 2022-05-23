import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import cachios from 'cachios'
import Modal from 'components/Modal'
import Media from 'components/Common/Media'
import { parseImgUrl, timeAgo, prettyTruncate, prettyBalance } from 'utils/common'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import CopyLink from 'components/Common/CopyLink'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { SHOW_TX_HASH_LINK } from 'constants/common'
import { useRouter } from 'next/router'
import useStore from 'lib/store'

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

	if (type === 'add_bid') {
		return `${activity.from} add bid for ${formatNearAmount(activity.msg.params.price)}`
	}

	if (type === 'cancel_bid') {
		return `${activity.from} cancel bid ${formatNearAmount(activity.msg.params.price)}`
	}

	return ``
}

const ActivityDetail = ({ activity, index }) => {
	const { localeLn } = useIntl()
	const [showModal, setShowModal] = useState(null)
	const [isCopied, setIsCopied] = useState(false)
	const [localToken, setLocalToken] = useState(null)
	const [showDetailActivity, setShowDetailActivity] = useState(-1)

	const shareLink = `${process.env.BASE_URL}/activity/${activity._id}`
	const [isFlipped, setIsFlipped] = useState(true)
	const [localTradedToken, setLocalTradedToken] = useState(null)
	const topCardPositionStyle = `-top-10 left-0 md:left-0 z-30`
	const bottomCardPositionStyle = `-top-8 left-2 md:left-2 z-20`
	const isTradeActivity = activity?.type?.includes('trade')
	const router = useRouter()
	const store = useStore()

	const HEADERS = [
		{
			id: 'title',
			title: 'Title',
			className: `w-3/12 p-3 h-full`,
		},
		{
			id: 'price',
			title: 'Price',
			className: `items-center text-center w-2/12 p-3 h-full`,
		},
		{
			id: 'from',
			title: 'From',
			className: `items-center w-2/12 p-3 h-full`,
		},
		{
			id: 'to',
			title: 'To',
			className: `items-center w-2/12 p-3 h-full`,
		},
		{
			id: 'time',
			title: 'Time',
			className: `w-4/12 md:w-2/12 pr-2 md:p-0 lg:p-3 text-center md:h-full`,
		},
		{
			id: 'type',
			title: 'Type',
			className: `w-2/12 p-3 h-full`,
		},
	]

	const parseType = (creator, price, from, to, type, isOffer = null) => {
		if (
			(type === 'nft_transfer' && price && from && to) ||
			(type === 'resolve_purchase' && price)
		) {
			if (isOffer) {
				return 'Accept'
			}
			return 'Sold'
		} else if (type === 'nft_transfer' && from === null) {
			return 'Minted'
		}

		if (type === 'nft_transfer' && to === null) {
			return 'Burned'
		}

		if (type === 'nft_transfer' && (!price || to === creator)) {
			return 'Transfer'
		}

		if (type === 'nft_set_series_price') {
			return 'Set Price'
		}

		if (type === 'notification_add_offer' || type === 'add_offer') {
			return 'Offer'
		}

		if (type === 'delete_offer') {
			return 'Delete Offer'
		}

		if (type === 'notification_category_accepted' || type === 'notification_category_rejected') {
			return 'Submission'
		}

		if (type === 'nft_create_series') {
			return 'Creation'
		}

		if (
			(type === 'add_market_data' || type === 'update_market_data') &&
			!activity.msg.params.is_auction
		) {
			return 'Listing'
		}

		if (type === 'delete_market_data') {
			return 'Remove Sale'
		}

		if (type === 'add_trade') {
			return 'Add Trade'
		}

		if (type === 'delete_trade') {
			return 'Delete Trade'
		}

		if (type === 'accept_trade') {
			return 'Accept Trade'
		}

		if (type === 'nft_decrease_series_copies') {
			return 'Decrease Copy'
		}

		if (type === 'accept_trade') {
			return 'Accept Trade'
		}

		if (type === 'nft_decrease_series_copies') {
			return 'Decrease Copy'
		}

		if (type === 'add_market_data' || activity.msg.params.is_auction) {
			return 'Auction'
		}

		if (type === 'add_bid') {
			return 'Bid'
		}

		if (type === 'cancel_bid') {
			return 'Cancel Bid'
		}

		return type
	}

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

	const showDetail = (index) => {
		if (showDetailActivity == index) setShowDetailActivity(-1)
		else setShowDetailActivity(index)
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
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md text-black">
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
			<div key={activity._id} className="text-white">
				<div className="w-full">
					<div className="hidden md:block">
						<div className="flex flex-row w-full text-gray-300 hover:opacity-75 items-center">
							{index === 0 &&
								HEADERS.map((d, index) => {
									return (
										<div key={d.id} className={`${HEADERS[index].className} h-full`}>
											<span className="capitalize">{localeLn(d.title)}</span>
										</div>
									)
								})}
						</div>
					</div>

					<div className="flex flex-row items-center justify-between w-full cursor-pointer sm:cursor-default md:inline-flex md:w-full md:h-19 md:hover:bg-gray-800 md:hover:bg-opacity-50">
						<div className="flex items-center md:cursor-pointer md:w-3/12">
							<div className="w-8 my-2 mr-8 ml-2 bg-transparent rounded-lg z-20 relative">
								<div
									className={`${
										isTradeActivity
											? `absolute w-14 cursor-pointer ${
													isFlipped
														? `transition-all ${topCardPositionStyle}`
														: `transition-all ${bottomCardPositionStyle}`
											  }`
											: `w-16 h-16 mx-auto`
									}`}
									onClick={() => isTradeActivity && setIsFlipped(!isFlipped)}
								>
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
										<a onClick={(e) => isTradeActivity && e.preventDefault()}>
											<Media
												className="rounded-lg overflow-hidden"
												url={parseImgUrl(localToken?.metadata.media, null, {
													width: `300`,
													useOriginal: process.env.APP_ENV === 'production' ? false : true,
													isMediaCdn: localToken?.isMediaCdn,
												})}
												videoControls={false}
												videoLoop={true}
												videoMuted={true}
												autoPlay={false}
												playVideoButton={false}
											/>
										</a>
									</Link>
								</div>

								{isTradeActivity && (
									<div
										className={`${
											isTradeActivity
												? `absolute w-14 cursor-pointer ${
														!isFlipped
															? `transition-all ${topCardPositionStyle}`
															: `transition-all ${bottomCardPositionStyle}`
												  }`
												: `w-16 h-16 mx-auto`
										}`}
										onClick={() => isTradeActivity && setIsFlipped(!isFlipped)}
									>
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
											<a onClick={(e) => isTradeActivity && e.preventDefault()}>
												<Media
													className="rounded-lg overflow-hidden object-cover"
													url={parseImgUrl(localTradedToken?.metadata.media, null, {
														width: `300`,
														useOriginal: process.env.APP_ENV === 'production' ? false : true,
														isMediaCdn: localTradedToken?.isMediaCdn,
													})}
													videoControls={false}
													videoLoop={true}
													videoMuted={true}
													autoPlay={false}
													playVideoButton={false}
												/>
											</a>
										</Link>
									</div>
								)}
							</div>
							<div className="pl-4 overflow-hidden cursor-pointer w-40">
								<Link
									href={`/collection/${
										localToken?.metadata?.collection_id || localToken?.contract_id
									}`}
								>
									<a>
										<p className="opacity-80 truncate text-xs py-1 font-thin border-b-2 border-transparent hover:opacity-50 cursor-pointer">
											{localToken?.metadata?.collection_id
												? isTradeActivity
													? localTradedToken?.metadata?.collection
													: localToken?.metadata.collection
												: isTradeActivity
												? localTradedToken?.metadata?.contract_id
												: localToken?.contract_id}
										</p>
									</a>
								</Link>
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
									<a className="font-semibold z-20 text-sm md:text-md hover:text-gray-300">
										{prettyTruncate(localToken?.metadata.title, 25)}
									</a>
								</Link>
								<Link href={`/token/${activity.contract_id}::${activity.token_series_id}`}>
									<p className="w-min md:hidden font-semibold truncate z-20">
										{activity.msg.params.price !== null
											? `${prettyBalance(activity.msg.params.price, 24, 4)} Ⓝ `
											: '---'}
									</p>
								</Link>
							</div>
						</div>
						<div
							className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base font-bold justify-center`}
						>
							{activity.msg.params.price !== null
								? `${prettyBalance(activity.msg.params.price, 24, 4)} Ⓝ `
								: '---'}
						</div>
						<div
							className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
						>
							<Link href={`/${activity.from}`}>
								<a className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
									{activity.from ? prettyTruncate(activity.from, 12, 'address') : '---'}
								</a>
							</Link>
						</div>
						<div
							className={`${HEADERS[3].className} hidden md:flex md:text-sm lg:text-base justify-start`}
						>
							<Link href={`/${activity.to}`}>
								<a className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
									{activity.to ? prettyTruncate(activity.to, 12, 'address') : '---'}
								</a>
							</Link>
						</div>
						<div
							className={`${HEADERS[4].className} text-xs text-right sm:text-base md:text-sm font-thin`}
						>
							<div className="flex flex-col md:flex-col justify-center items-end md:items-center">
								<div className="flex flex-col relative top-1 items-center justify-center pb-1 md:hidden">
									<div className="font-bold text-gray-300">
										{parseType(
											activity.creator_id,
											activity.price,
											activity.from,
											activity.to,
											activity.type
										)}
									</div>
								</div>
								<div className="hidden md:flex md:flex-row text-gray-50 opacity-50">
									{timeAgo.format(
										new Date(activity.issued_at ? activity.issued_at : 1636197684986)
									)}
								</div>
								<div className="flex flex-row md:flex-row mt-1 text-gray-50 opacity-50">
									<div
										onClick={() => setShowModal('options')}
										className="cursor-pointer w-8 h-4 md:h-8 rounded-full transition-all duration-200 hover:bg-dark-primary-4 flex items-center justify-end md:justify-center"
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
									{SHOW_TX_HASH_LINK && activity.transaction_hash && (
										<a
											href={`https://${
												process.env.APP_ENV === 'production' ? `` : `testnet.`
											}nearblocks.io/txns/${activity.transaction_hash}${
												activity.msg?.receipt_id && `#${activity.msg?.receipt_id}`
											}`}
											target={`_blank`}
										>
											<div className="w-8 h-4 md:h-8 rounded-full transition-all duration-200 hover:bg-dark-primary-4 flex items-center justify-end md:justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="icon icon-tabler icon-tabler-external-link"
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
													<path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
													<line x1={10} y1={14} x2={20} y2={4} />
													<polyline points="15 4 20 4 20 9" />
												</svg>
											</div>
										</a>
									)}
								</div>
								<div
									className="flex md:hidden flex-row text-right items-center mt-2 text-gray-50 opacity-50"
									onClick={() => showDetail(index)}
								>
									{timeAgo.format(
										new Date(activity.issued_at ? activity.issued_at : 1636197684986)
									)}
									<svg
										width="10"
										height="10"
										viewBox="0 0 21 19"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="ml-2 md:mt-0"
									>
										<path
											d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z"
											fill="white"
										/>
									</svg>
								</div>
							</div>
						</div>
						<div
							className={`${HEADERS[4].className} font-thin hidden md:flex md:text-sm lg:text-base justify-start`}
						>
							{parseType(
								activity.creator_id,
								activity.price,
								activity.from,
								activity.to,
								activity.type
							)}
						</div>
					</div>
				</div>

				{showDetailActivity == index && (
					<div
						key={activity._id}
						className="flex order-5 w-full justify-between items-center my-2 py-2 border-t-2 border-b-2 border-opacity-10 border-white text-xs md:hidden"
					>
						<div className="flex flex-col flex-shrink text-center w-1/2">
							<p className="font-thin text-white text-opacity-50 pb-2">From</p>
							<Link href={`/${activity.from}`}>
								<p className="font-bold cursor-pointer">
									{activity.from ? prettyTruncate(activity.from, 12, 'address') : '---'}
								</p>
							</Link>
						</div>
						<div className="flex flex-col flex-shrink text-center w-1/2">
							<p className="font-thin text-white text-opacity-50 pb-2">To</p>
							<Link href={`/${activity.to}`}>
								<p className="font-bold cursor-pointer">
									{activity.to ? prettyTruncate(activity.to, 12, 'address') : '---'}
								</p>
							</Link>
						</div>
						<div className="flex flex-col flex-shrink text-center w-1/2">
							<p className="font-thin text-white text-opacity-50 pb-2">Usd Price</p>
							<p className="font-bold">
								{activity.price
									? store.nearUsdPrice !== 0 && (
											<>
												$
												{prettyBalance(
													Number(store.nearUsdPrice * formatNearAmount(activity.msg.params.price))
														.toPrecision(4)
														.toString(),
													0,
													6
												)}
											</>
									  )
									: '---'}
							</p>
						</div>
					</div>
				)}
			</div>
		</Fragment>
	)
}

export default ActivityDetail
